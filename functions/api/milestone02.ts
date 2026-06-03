interface Env { NEFERTARI_KV: KVNamespace; }

const KEY = 'milestone02:feedback';

interface Feedback {
  mc_site:       string; mc_site_note:    string;
  mc_cardapio:   string; mc_cardapio_note:string;
  mc_painel:     string; mc_painel_note:  string;
  q_faltando:    string;
  q_melhorar:    string;
  updated_at:    string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const raw = await env.NEFERTARI_KV.get(KEY, { type: 'json' }) as Feedback | null;
  return Response.json(raw ?? null, { headers: cors() });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as Omit<Feedback, 'updated_at'>;
    await env.NEFERTARI_KV.put(KEY, JSON.stringify({ ...body, updated_at: new Date().toISOString() }));
    return Response.json({ ok: true }, { headers: cors() });
  } catch {
    return Response.json({ ok: false }, { status: 400, headers: cors() });
  }
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { headers: cors() });

function cors() {
  return {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
