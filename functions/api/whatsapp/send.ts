import { sendWhatsAppMessage, generateBrandMessage } from '../../lib/whatsapp';

interface Env { NEFERTARI_KV: KVNamespace; }

interface SendBody {
  phone:         string;
  text?:         string;
  customerName?: string;
  orderId?:      string;
  pin?:          string;
  total?:        number;
  type?:         'pickup' | 'delivery';
  status?:       'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'pin';
  items?:        Array<{ name: string; qty: number }>;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as SendBody;
    if (!body.phone) {
      return Response.json({ ok: false, error: 'Telefone é obrigatório.' }, { status: 400, headers: cors() });
    }

    let messageText = body.text?.trim() ?? '';

    // If no explicit text was provided but status info was, generate a dynamic brand message
    if (!messageText && body.status) {
      messageText = generateBrandMessage({
        status:       body.status,
        customerName: body.customerName ?? 'Cliente',
        orderId:      body.orderId,
        pin:          body.pin,
        total:        body.total,
        type:         body.type,
        items:        body.items,
      });
    }

    if (!messageText) {
      return Response.json({ ok: false, error: 'Mensagem vazia.' }, { status: 400, headers: cors() });
    }

    const result = await sendWhatsAppMessage(env, body.phone, messageText);
    return Response.json({ ok: result.ok, error: result.error, sentMessage: messageText }, { headers: cors() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: msg }, { status: 500, headers: cors() });
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { headers: cors() });

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
