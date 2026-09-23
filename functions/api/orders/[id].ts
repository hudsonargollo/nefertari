import { sendWhatsAppMessage, generateBrandMessage, getWhatsAppConfig } from '../../lib/whatsapp';

interface Env { NEFERTARI_KV: KVNamespace; }

const ACTIVE_KEY = 'orders:active';

function orderKey(id: string) { return `orders:${id}`; }

const TERMINAL = new Set(['delivered', 'cancelled']);

interface OrderData {
  id:         string;
  customer:   { name: string; phone: string };
  type:       'pickup' | 'delivery';
  address?:   string;
  items:      Array<{ name: string; qty: number; price: number }>;
  total:      number;
  notes?:     string;
  status:     'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  pin?:       string;
  created_at: string;
  updated_at: string;
}

// GET — single order (customer status page + kitchen panel)
export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const id   = params.id as string;
  const data = await env.NEFERTARI_KV.get(orderKey(id), { type: 'json' });
  if (!data) return Response.json({ error: 'not_found' }, { status: 404, headers: cors() });
  return Response.json(data, { headers: cors() });
};

// PATCH — update order status (kitchen panel)
export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const id = params.id as string;

  const current = await env.NEFERTARI_KV.get(orderKey(id), { type: 'json' }) as OrderData | null;
  if (!current) return Response.json({ error: 'not_found' }, { status: 404, headers: cors() });

  const { status, customMessage } = await request.json() as { status: OrderData['status']; customMessage?: string };
  const prevStatus = current.status;
  const updated = { ...current, status, updated_at: new Date().toISOString() };
  await env.NEFERTARI_KV.put(orderKey(id), JSON.stringify(updated));

  // Remove from active index if terminal status
  if (TERMINAL.has(status)) {
    const activeRaw = await env.NEFERTARI_KV.get(ACTIVE_KEY, { type: 'json' });
    const active    = ((activeRaw as string[] | null) ?? []).filter(i => i !== id);
    await env.NEFERTARI_KV.put(ACTIVE_KEY, JSON.stringify(active));
  }

  // ── Dispatch automatic WhatsApp notification if status changed ─────────────
  if (status !== prevStatus) {
    try {
      const config = await getWhatsAppConfig(env);
      if (config.autoNotify) {
        const message = customMessage || generateBrandMessage({
          status,
          customerName: current.customer?.name ?? 'Cliente',
          orderId: id,
          pin: current.pin,
          total: current.total,
          type: current.type,
          items: current.items,
        });

        if (current.customer?.phone) {
          await sendWhatsAppMessage(env, current.customer.phone, message);
        }
      }
    } catch { /* WhatsApp notification non-blocking */ }
  }

  return Response.json({ ok: true, status }, { headers: cors() });
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { headers: cors() });

function cors() {
  return {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
