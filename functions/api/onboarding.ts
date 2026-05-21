interface Env {
  NEFERTARI_KV: KVNamespace;
}

const KV_KEY = 'onboarding:nefertari';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const data = await env.NEFERTARI_KV.get(KV_KEY, { type: 'json' });
  return Response.json(data ?? null, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as Record<string, string>;
    await env.NEFERTARI_KV.put(KV_KEY, JSON.stringify({
      ...body,
      updated_at: new Date().toISOString(),
    }));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
