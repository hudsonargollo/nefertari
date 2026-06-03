import { queueNotification } from './auth.js';

interface Env { NEFERTARI_KV: KVNamespace; }

const SELOS_PER_CYCLE = 10;

export interface CRMCustomer {
  phone:            string;
  name:             string;
  orderCount:       number;
  totalSpent:       number;
  firstOrder:       string;
  lastOrder:        string;
  orders:           string[];
  notes:            string;
  tags:             string[];
  loyaltyPoints?:   number;   // 0-(SELOS_PER_CYCLE-1), resets on reward claim
  totalCycles?:     number;
  pendingReward?:   boolean;
  pinHash?:         string;
}

export interface OrderItem { id: string; name: string; price: number; qty: number; }

export interface Order {
  id:         string;
  customer:   { name: string; phone: string; };
  type:       'pickup' | 'delivery';
  address?:   string;
  items:      OrderItem[];
  total:      number;
  notes?:     string;
  status:     'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

const INDEX_KEY  = 'orders:index';
const ACTIVE_KEY = 'orders:active';

function orderKey(id: string) { return `orders:${id}`; }

function genId(): string {
  const now  = new Date();
  const date = `${String(now.getDate()).padStart(2,'0')}${String(now.getMonth()+1).padStart(2,'0')}`;
  const rand = crypto.randomUUID().slice(0, 4).toUpperCase();
  return `NEF-${date}-${rand}`;
}

// GET — list all orders (kitchen panel)
export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url      = new URL(request.url);
  const activeOnly = url.searchParams.get('active') === 'true';

  const indexRaw = await env.NEFERTARI_KV.get(activeOnly ? ACTIVE_KEY : INDEX_KEY, { type: 'json' });
  const ids      = (indexRaw as string[] | null) ?? [];

  const orders = await Promise.all(
    ids.map(id => env.NEFERTARI_KV.get(orderKey(id), { type: 'json' }))
  );

  return Response.json(orders.filter(Boolean), { headers: cors() });
};

// POST — place new order
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as Omit<Order, 'id' | 'status' | 'created_at' | 'updated_at'>;
    const now  = new Date().toISOString();
    const id   = genId();

    const order: Order = { ...body, id, status: 'received', created_at: now, updated_at: now };

    // Save order
    await env.NEFERTARI_KV.put(orderKey(id), JSON.stringify(order));

    // Update order indexes
    const [indexRaw, activeRaw] = await Promise.all([
      env.NEFERTARI_KV.get(INDEX_KEY,  { type: 'json' }),
      env.NEFERTARI_KV.get(ACTIVE_KEY, { type: 'json' }),
    ]);
    const index  = ([id, ...((indexRaw  as string[] | null) ?? [])]).slice(0, 200);
    const active = ([id, ...((activeRaw as string[] | null) ?? [])]);

    // Auto-capture CRM customer profile
    const phone      = body.customer.phone.replace(/\D/g, '');
    const crmKey     = `crm:${phone}`;
    const crmIdxKey  = 'crm:index';
    const existing   = await env.NEFERTARI_KV.get(crmKey, { type: 'json' }) as CRMCustomer | null;
    const crmIdx     = (await env.NEFERTARI_KV.get(crmIdxKey, { type: 'json' }) as string[] | null) ?? [];

    // ── Loyalty calculation ──────────────────────────────────────────────────
    const prevPoints  = existing?.loyaltyPoints  ?? 0;
    const prevCycles  = existing?.totalCycles    ?? 0;
    const prevPending = existing?.pendingReward  ?? false;

    // Verify auth token matches the ordering customer (loyalty only credited when authenticated)
    const authToken = request.headers.get('X-Auth-Token');
    let tokenPhone: string | null = null;
    if (authToken) {
      const authData = await env.NEFERTARI_KV.get(`auth:${authToken}`, { type:'json' }) as { phone:string; expires:number }|null;
      if (authData && Date.now() < authData.expires) tokenPhone = authData.phone;
    }
    const isRegistered = !!existing?.pinHash && tokenPhone === phone;
    let newPoints  = prevPoints;
    let newCycles  = prevCycles;
    let newPending = prevPending;

    if (isRegistered && !prevPending) {
      newPoints = prevPoints + 1;
      if (newPoints >= SELOS_PER_CYCLE) {
        newPoints  = 0;
        newCycles  = prevCycles + 1;
        newPending = true;
        // Trigger 4: reward unlocked
        await queueNotification(env, {
          phone, name: body.customer.name, trigger: 'reward_unlocked',
          message: `Você chegou lá! 🎉 Sua recompensa sazonal está liberada. Entre no nosso cardápio, faça seu login e adicione o presente da Jess no seu próximo carrinho. Obrigado por valorizar a comida de verdade!`,
        });
      } else if (newPoints === 9) {
        // Trigger 3: one away
        await queueNotification(env, {
          phone, name: body.customer.name, trigger: 'one_away',
          message: `Falta só mais um, ${body.customer.name}! 🤎 No seu próximo pedido com a gente, você desbloqueia a surpresa especial que a Jess criou para essa estação. O que será que vem por aí?`,
        });
      } else if (newPoints === 5) {
        // Trigger 2: halfway
        await queueNotification(env, {
          phone, name: body.customer.name, trigger: 'halfway',
          message: `Metade do caminho, ${body.customer.name}! ✨ Você já tem 5 selos. A receita sazonal dessa estação já tá quase nas suas mãos. Bom apetite e até o próximo pedido!`,
        });
      }
    }

    const updated: CRMCustomer = {
      phone,
      name:           body.customer.name,
      orderCount:     (existing?.orderCount  ?? 0) + 1,
      totalSpent:     (existing?.totalSpent  ?? 0) + body.total,
      firstOrder:     existing?.firstOrder ?? now,
      lastOrder:      now,
      orders:         [id, ...(existing?.orders ?? [])].slice(0, 50),
      notes:          existing?.notes      ?? '',
      tags:           existing?.tags       ?? [],
      pinHash:        existing?.pinHash,
      loyaltyPoints:  newPoints,
      totalCycles:    newCycles,
      pendingReward:  newPending,
    };

    const newCrmIdx = crmIdx.includes(phone) ? crmIdx : [phone, ...crmIdx];

    await Promise.all([
      env.NEFERTARI_KV.put(INDEX_KEY,  JSON.stringify(index)),
      env.NEFERTARI_KV.put(ACTIVE_KEY, JSON.stringify(active)),
      env.NEFERTARI_KV.put(crmKey,     JSON.stringify(updated)),
      env.NEFERTARI_KV.put(crmIdxKey,  JSON.stringify(newCrmIdx)),
    ]);

    return Response.json({ ok: true, id }, { headers: cors() });
  } catch {
    return Response.json({ ok: false, error: 'Invalid payload' }, { status: 400, headers: cors() });
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { headers: cors() });

function cors() {
  return {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
