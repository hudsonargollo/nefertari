interface Env { NEFERTARI_KV: KVNamespace; }

const KEY = 'notifications:queue';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const q = (await env.NEFERTARI_KV.get(KEY, { type:'json' }) as unknown[]|null) ?? [];
  return Response.json(q, { headers:cors() });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const { action, index } = await request.json() as { action:string; index:number };
  if (action === 'mark_sent') {
    const q = (await env.NEFERTARI_KV.get(KEY, { type:'json' }) as Record<string,unknown>[]|null) ?? [];
    if (q[index]) q[index].sent = true;
    await env.NEFERTARI_KV.put(KEY, JSON.stringify(q));
    return Response.json({ ok:true }, { headers:cors() });
  }
  return Response.json({ ok:false }, { headers:cors() });
};

export const onRequestOptions: PagesFunction = async () => new Response(null, { headers:cors() });

function cors() {
  return { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Methods':'GET, POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type' };
}
