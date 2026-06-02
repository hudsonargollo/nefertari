interface Env { NEFERTARI_KV: KVNamespace; }

const CRM_INDEX = 'crm:index';

// GET — list all customers, sorted by lastOrder desc
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const phones = (await env.NEFERTARI_KV.get(CRM_INDEX, { type: 'json' }) as string[] | null) ?? [];
  const customers = await Promise.all(
    phones.map(p => env.NEFERTARI_KV.get(`crm:${p}`, { type: 'json' }))
  );
  const sorted = customers
    .filter(Boolean)
    .sort((a: any, b: any) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime());
  return Response.json(sorted, { headers: cors() });
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { headers: cors() });

function cors() {
  return {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
