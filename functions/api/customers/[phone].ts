interface Env { NEFERTARI_KV: KVNamespace; }

function crmKey(phone: string) { return `crm:${phone.replace(/\D/g,'')}` ; }

// GET — single customer profile
export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const data = await env.NEFERTARI_KV.get(crmKey(params.phone as string), { type: 'json' });
  if (!data) return Response.json({ error: 'not_found' }, { status: 404, headers: cors() });
  return Response.json(data, { headers: cors() });
};

// PATCH — update notes and tags (manual CRM data from Jéssica)
export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const key      = crmKey(params.phone as string);
  const existing = await env.NEFERTARI_KV.get(key, { type: 'json' }) as Record<string,unknown> | null;
  if (!existing) return Response.json({ error: 'not_found' }, { status: 404, headers: cors() });

  const { notes, tags } = await request.json() as { notes?: string; tags?: string[] };
  const updated = {
    ...existing,
    ...(notes !== undefined && { notes }),
    ...(tags  !== undefined && { tags  }),
  };
  await env.NEFERTARI_KV.put(key, JSON.stringify(updated));
  return Response.json({ ok: true }, { headers: cors() });
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
