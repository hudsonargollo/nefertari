interface Env { NEFERTARI_KV: KVNamespace; }

const PIN_KEY     = 'painel:pin';
const DEFAULT_PIN = '1234';

// POST { pin } → validates PIN, returns { ok, token }
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const { pin } = await request.json() as { pin: string };

  const stored = (await env.NEFERTARI_KV.get(PIN_KEY)) ?? DEFAULT_PIN;
  if (pin !== stored) {
    return Response.json({ ok: false, error: 'PIN incorreto' }, { status: 401, headers: cors() });
  }

  // Issue a session token valid for 8 hours
  const token   = crypto.randomUUID();
  const expires = Date.now() + 8 * 60 * 60 * 1000;
  await env.NEFERTARI_KV.put(`painel:token:${token}`, String(expires), { expirationTtl: 8 * 3600 });

  return Response.json({ ok: true, token }, { headers: cors() });
};

// PUT { currentPin, newPin } → change PIN
export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const { currentPin, newPin } = await request.json() as { currentPin: string; newPin: string };
  const stored = (await env.NEFERTARI_KV.get(PIN_KEY)) ?? DEFAULT_PIN;

  if (currentPin !== stored) {
    return Response.json({ ok: false, error: 'PIN atual incorreto' }, { status: 401, headers: cors() });
  }
  if (!newPin || newPin.length < 4) {
    return Response.json({ ok: false, error: 'Novo PIN precisa ter ao menos 4 dígitos' }, { status: 400, headers: cors() });
  }

  await env.NEFERTARI_KV.put(PIN_KEY, newPin);
  return Response.json({ ok: true }, { headers: cors() });
};

// GET /api/painel/auth?token=xxx → validate session token
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const token   = new URL(request.url).searchParams.get('token') ?? '';
  const expires = await env.NEFERTARI_KV.get(`painel:token:${token}`);
  const valid   = !!expires && Date.now() < Number(expires);
  return Response.json({ valid }, { headers: cors() });
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { headers: cors() });

function cors() {
  return {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
