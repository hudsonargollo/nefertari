interface Env { NEFERTARI_KV: KVNamespace; }

export interface CRMCustomer {
  phone:      string;
  name:       string;
  orderCount: number;
  totalSpent: number;
  firstOrder: string;
  lastOrder:  string;
  orders:     string[];
  notes:      string;
  tags:       string[];
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

    const updated: CRMCustomer = {
      phone,
      name:        body.customer.name,
      orderCount:  (existing?.orderCount  ?? 0) + 1,
      totalSpent:  (existing?.totalSpent  ?? 0) + body.total,
      firstOrder:  existing?.firstOrder ?? now,
      lastOrder:   now,
      orders:      [id, ...(existing?.orders ?? [])].slice(0, 50),
      notes:       existing?.notes ?? '',
      tags:        existing?.tags  ?? [],
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
