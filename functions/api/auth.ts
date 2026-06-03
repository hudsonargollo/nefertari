interface Env { NEFERTARI_KV: KVNamespace; }

const SELOS_PER_CYCLE = 10;
const TOKEN_TTL       = 7 * 24 * 3600; // 7 days in seconds

// ─── Helpers ─────────────────────────────────────────────────────────────────
function cleanPhone(raw: string) { return raw.replace(/\D/g, ''); }

async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(pin);
  const buf  = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function issueToken(env: Env, phone: string): Promise<string> {
  const token   = crypto.randomUUID();
  const expires = Date.now() + TOKEN_TTL * 1000;
  await env.NEFERTARI_KV.put(`auth:${token}`, JSON.stringify({ phone, expires }), { expirationTtl: TOKEN_TTL });
  return token;
}

function crmKey(phone: string) { return `crm:${phone}`; }

// ─── POST /api/auth/register ──────────────────────────────────────────────────
async function register(env: Env, body: { name: string; phone: string }) {
  const phone = cleanPhone(body.phone);
  if (!phone || !body.name?.trim()) return { ok:false, error:'name_and_phone_required' };

  const existing = await env.NEFERTARI_KV.get(crmKey(phone), { type:'json' }) as Record<string,unknown>|null;
  if (existing?.pinHash) return { ok:false, error:'already_registered' };

  const pinHash = await hashPin('1234');
  const now     = new Date().toISOString();

  const customer = {
    ...(existing ?? {}),
    phone, name: body.name.trim(), pinHash,
    loyaltyPoints: 0, totalCycles: 0, pendingReward: false, claimedRewardIds: [],
    orderCount: existing?.orderCount ?? 0,
    totalSpent: existing?.totalSpent ?? 0,
    firstOrder: existing?.firstOrder ?? now,
    lastOrder:  existing?.lastOrder  ?? now,
    orders:     existing?.orders     ?? [],
    notes:      existing?.notes      ?? '',
    tags:       existing?.tags       ?? [],
    joinedAt:   now,
  };

  // update crm index
  const idx = (await env.NEFERTARI_KV.get('crm:index', { type:'json' }) as string[]|null) ?? [];
  if (!idx.includes(phone)) {
    await env.NEFERTARI_KV.put('crm:index', JSON.stringify([phone, ...idx]));
  }

  await env.NEFERTARI_KV.put(crmKey(phone), JSON.stringify(customer));

  // queue welcome notification
  await queueNotification(env, {
    phone, name: body.name.trim(), trigger: 'welcome',
    message: `Oi, ${body.name.trim()}! Que alegria ter você com a gente. Seu ritual na Nefertari começou! 🌿 Guarde seu PIN temporário: 1234 (você pode trocar quando quiser no site). A cada 10 pedidos, a Jess prepara uma receita sazonal surpresa só pra você. Vamos começar?`,
  });

  const token = await issueToken(env, phone);
  const { pinHash: _ph, ...safe } = customer;
  return { ok:true, token, customer: safe };
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
async function login(env: Env, body: { phone: string; pin: string }) {
  const phone = cleanPhone(body.phone);
  const customer = await env.NEFERTARI_KV.get(crmKey(phone), { type:'json' }) as Record<string,unknown>|null;

  if (!customer?.pinHash) return { ok:false, error:'not_found' };

  const pinHash = await hashPin(body.pin);
  if (pinHash !== customer.pinHash) return { ok:false, error:'invalid_pin' };

  const token = await issueToken(env, phone);
  const { pinHash: _ph, ...safe } = customer;
  return { ok:true, token, customer: safe };
}

// ─── POST /api/auth/change-pin ────────────────────────────────────────────────
async function changePin(env: Env, body: { token: string; newPin: string }) {
  const authData = await env.NEFERTARI_KV.get(`auth:${body.token}`, { type:'json' }) as { phone:string; expires:number }|null;
  if (!authData || Date.now() > authData.expires) return { ok:false, error:'invalid_token' };
  if (!body.newPin || body.newPin.length < 4) return { ok:false, error:'pin_too_short' };

  const phone    = authData.phone;
  const customer = await env.NEFERTARI_KV.get(crmKey(phone), { type:'json' }) as Record<string,unknown>|null;
  if (!customer) return { ok:false, error:'customer_not_found' };

  await env.NEFERTARI_KV.put(crmKey(phone), JSON.stringify({ ...customer, pinHash: await hashPin(body.newPin) }));
  return { ok:true };
}

// ─── GET /api/auth/validate?token= ───────────────────────────────────────────
async function validate(env: Env, token: string) {
  const authData = await env.NEFERTARI_KV.get(`auth:${token}`, { type:'json' }) as { phone:string; expires:number }|null;
  if (!authData || Date.now() > authData.expires) return { valid:false };
  return { valid:true, phone: authData.phone };
}

// ─── Notification queue ───────────────────────────────────────────────────────
export async function queueNotification(env: Env, n: { phone:string; name:string; trigger:string; message:string }) {
  const key    = 'notifications:queue';
  const queue  = (await env.NEFERTARI_KV.get(key, { type:'json' }) as unknown[]|null) ?? [];
  const entry  = { ...n, ts: new Date().toISOString(), sent: false };
  await env.NEFERTARI_KV.put(key, JSON.stringify([entry, ...queue].slice(0, 200)));
}

// ─── Route handler ────────────────────────────────────────────────────────────
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const url    = new URL(request.url);
  const action = url.searchParams.get('action') ?? url.pathname.split('/').pop();
  const body   = await request.json() as Record<string,string>;

  let result: Record<string,unknown>;
  if (action === 'register')   result = await register(env, body as { name:string; phone:string });
  else if (action === 'login') result = await login(env, body as { phone:string; pin:string });
  else if (action === 'change-pin') result = await changePin(env, body as { token:string; newPin:string });
  else result = { ok:false, error:'unknown_action' };

  return Response.json(result, { headers: cors() });
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const token  = new URL(request.url).searchParams.get('token') ?? '';
  const result = await validate(env, token);
  return Response.json(result, { headers: cors() });
};

export const onRequestOptions: PagesFunction = async () => new Response(null, { headers: cors() });

function cors() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
