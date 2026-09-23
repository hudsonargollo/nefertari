import { getWhatsAppConfig } from '../../lib/whatsapp';

interface Env { NEFERTARI_KV: KVNamespace; }

export const onRequestPost: PagesFunction<Env> = async ({ env }) => {
  try {
    const config = await getWhatsAppConfig(env);
    const baseUrl = config.serverUrl.replace(/\/$/, '');

    // 1. Try to fetch existing or create instance
    await fetch(`${baseUrl}/instance/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': config.apiKey },
      body: JSON.stringify({
        instanceName: config.instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
      }),
    });

    // 2. Request QR code connection
    const connectRes = await fetch(`${baseUrl}/instance/connect/${config.instanceName}`, {
      headers: { 'apikey': config.apiKey },
    });

    const data = await connectRes.json() as { base64?: string; qrcode?: { base64?: string } };
    const qrcode = data.base64 ?? data.qrcode?.base64 ?? null;

    return Response.json({ ok: true, qrcode }, { headers: cors() });
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
