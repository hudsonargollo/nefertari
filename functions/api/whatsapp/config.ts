import { getWhatsAppConfig, saveWhatsAppConfig, type WhatsAppConfig } from '../../lib/whatsapp';

interface Env { NEFERTARI_KV: KVNamespace; }

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const config = await getWhatsAppConfig(env);
  return Response.json(config, { headers: cors() });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as Partial<WhatsAppConfig>;
    await saveWhatsAppConfig(env, body);
    const updated = await getWhatsAppConfig(env);
    return Response.json({ ok: true, config: updated }, { headers: cors() });
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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
