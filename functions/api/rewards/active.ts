interface Env { NEFERTARI_KV: KVNamespace; }

// Public — returns the current active seasonal reward
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const reward = await env.NEFERTARI_KV.get('rewards:active', { type:'json' });
  return Response.json(reward ?? null, { headers:cors() });
};

export const onRequestOptions: PagesFunction = async () => new Response(null, { headers:cors() });

function cors() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
