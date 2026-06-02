interface Env { NEFERTARI_KV: KVNamespace; }

export interface MenuItem {
  id:          string;
  category:    'burger' | 'wrap' | 'side' | 'drink';
  name:        string;
  description: string;
  price:       number;
  available:   boolean;
  tags:        string[];
}

const MENU_KEY = 'menu:items';

// Seed menu — used when KV is empty
const SEED: MenuItem[] = [
  // ── Hambúrgueres ──────────────────────────────────────────────────────────
  { id: 'bur-01', category: 'burger', name: 'Pirâmide', price: 28, available: true,
    tags: ['vegano'],
    description: 'Grão de bico artesanal, húmus, folhas frescas, tomate e molho de ervas ao azeite.' },
  { id: 'bur-02', category: 'burger', name: 'Kemet', price: 30, available: true,
    tags: ['vegano'],
    description: 'Soja texturizada, babaganoush, rúcula, cebola caramelizada e mostarda dijon.' },
  { id: 'bur-03', category: 'burger', name: 'Nilo', price: 28, available: true,
    tags: ['vegano'],
    description: 'Lentilha, cream cheese de castanhas, alface, pepino e molho de iogurte.' },
  { id: 'bur-04', category: 'burger', name: 'Fênix', price: 32, available: true,
    tags: [],
    description: 'Frango grelhado, crispy de cebola, pimenta roxa e aioli de limão siciliano.' },
  // ── Wraps ─────────────────────────────────────────────────────────────────
  { id: 'wra-01', category: 'wrap', name: 'Sálvia', price: 26, available: true,
    tags: [],
    description: 'Frango grelhado, mix de folhas, húmus artesanal, azeite de ervas e limão.' },
  { id: 'wra-02', category: 'wrap', name: 'Terra', price: 24, available: true,
    tags: ['vegano'],
    description: 'Grão de bico assado, legumes no forno, tahine caseiro e rúcula.' },
  // ── Acompanhamentos ───────────────────────────────────────────────────────
  { id: 'sid-01', category: 'side', name: 'Batata frita', price: 12, available: true,
    tags: ['vegano'],
    description: 'Crocante por fora, macia por dentro. Sal grosso e ervas frescas.' },
  // ── Bebidas ───────────────────────────────────────────────────────────────
  { id: 'dri-01', category: 'drink', name: 'Suco natural', price: 10, available: true,
    tags: ['vegano'],
    description: 'Laranja, limão ou abacaxi. Espremido na hora, sem açúcar adicionado.' },
  { id: 'dri-02', category: 'drink', name: 'Refrigerante', price: 6, available: true,
    tags: [],
    description: 'Lata gelada.' },
  { id: 'dri-03', category: 'drink', name: 'Água', price: 4, available: true,
    tags: [],
    description: 'Mineral sem gás 500ml.' },
];

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const stored = await env.NEFERTARI_KV.get(MENU_KEY, { type: 'json' }) as MenuItem[] | null;
  const items  = stored ?? SEED;
  return Response.json(items, { headers: cors() });
};

// POST — overwrite full menu (used by kitchen panel)
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const items = await request.json() as MenuItem[];
    await env.NEFERTARI_KV.put(MENU_KEY, JSON.stringify(items));
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
