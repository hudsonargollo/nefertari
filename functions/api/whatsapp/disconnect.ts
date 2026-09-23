import { getWhatsAppConfig } from '../../lib/whatsapp';

interface Env { NEFERTARI_KV: KVNamespace; }

export const onRequestPost: PagesFunction<Env> = async ({ env }) => {
  try {
    const config = await getWhatsAppConfig(env);
    const baseUrl = config.serverUrl.replace(/\/$/, '');

    const res = await fetch(`${baseUrl}/instance/logout/${config.instanceName}`, {
      method: 'DELETE',
      headers: { 'apikey': config.apiKey },
    });

    const data = await res.json();
    return Response.json({ ok: res.ok, data }, { headers: cors() });
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
