import { getWhatsAppConfig } from '../../lib/whatsapp';

interface Env { NEFERTARI_KV: KVNamespace; }

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const config = await getWhatsAppConfig(env);
    const baseUrl = config.serverUrl.replace(/\/$/, '');

    // Fetch instance connection state
    const stateRes = await fetch(`${baseUrl}/instance/connectionState/${config.instanceName}`, {
      headers: { 'apikey': config.apiKey },
    });

    let state = 'disconnected';
    let qrcode: string | null = null;
    let number: string | null = null;
    let profilePic: string | null = null;

    if (stateRes.ok) {
      const stateData = await stateRes.json() as { instance?: { state?: string } };
      state = stateData.instance?.state ?? 'disconnected';
    }

    if (state !== 'open') {
      // Try to fetch connect QR code
      const connectRes = await fetch(`${baseUrl}/instance/connect/${config.instanceName}`, {
        headers: { 'apikey': config.apiKey },
      });
      if (connectRes.ok) {
        const connectData = await connectRes.json() as { base64?: string; qrcode?: { base64?: string } };
        qrcode = connectData.base64 ?? connectData.qrcode?.base64 ?? null;
      }
    } else {
      // Instance connected, fetch instance details if available
      const instRes = await fetch(`${baseUrl}/instance/fetchInstances?instanceName=${config.instanceName}`, {
        headers: { 'apikey': config.apiKey },
      });
      if (instRes.ok) {
        const instData = await instRes.json() as Array<{ number?: string; profilePicUrl?: string; ownerJid?: string }>;
        const inst = instData?.[0];
        if (inst) {
          number = inst.number ?? inst.ownerJid?.replace(/@.*$/, '') ?? null;
          profilePic = inst.profilePicUrl ?? null;
        }
      }
    }

    return Response.json({
      ok: true,
      state: state === 'open' ? 'connected' : state === 'connecting' ? 'connecting' : 'disconnected',
      qrcode,
      number,
      profilePic,
      instanceName: config.instanceName,
      serverUrl: config.serverUrl,
      autoNotify: config.autoNotify,
    }, { headers: cors() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, state: 'disconnected', error: msg }, { status: 500, headers: cors() });
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { headers: cors() });

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
