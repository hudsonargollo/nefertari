interface Env { NEFERTARI_KV: KVNamespace; }

export interface MenuItem {
  id:           string;
  category:     string;
  name:         string;
  description:  string;
  price:        number;
  available:    boolean;
  tags:         string[];
  imageUrl?:    string;          // primary photo (base64 or URL)
  images?:      string[];        // all photos for gallery
  calories?:    number;          // kcal per serving
  ingredients?: string[];        // ingredient list for modal
}

export interface MenuCategory {
  id:     string;
  label:  string;
  sub:    string;
  roman:  string;
}

const MENU_KEY = 'menu:items:v2';
const CATS_KEY = 'menu:categories:v2';

export const SEED_ITEMS: MenuItem[] = [
  // ─── BURGERS ────────────────────────────────────────────────────────
  {
    id: 'bur-01',
    category: 'burger',
    name: 'Burger Raiz da Terra',
    price: 26,
    available: true,
    tags: ['vegano', 'artesanal'],
    imageUrl: '/1-piramide.webp',
    description: 'Pão comum, hambúrguer artesanal de proteína de soja e especiarias, queijo vegano de aipim, molho de castanha de caju, picles de cebola roxa, alface e tomate.',
    ingredients: [
      'Pão comum artesanal',
      'Hambúrguer artesanal com proteína de soja e especiarias',
      'Queijo vegano de aipim',
      'Molho de castanha de caju',
      'Picles de cebola roxa',
      'Alface e tomate frescos',
    ],
  },
  {
    id: 'bur-02',
    category: 'burger',
    name: 'Burger Grão de Bico',
    price: 28,
    available: true,
    tags: ['vegano', 'artesanal'],
    imageUrl: '/3-nilo.webp',
    description: 'Pão brioche leve, hambúrguer artesanal de grão-de-bico, ervas frescas e especiarias, queijo vegano de aipim, abacaxi grelhado, alface e tomate.',
    ingredients: [
      'Pão brioche leve',
      'Hambúrguer artesanal de grão-de-bico com ervas frescas e especiarias',
      'Queijo vegano de aipim',
      'Abacaxi grelhado',
      'Alface e tomate frescos',
    ],
  },
  {
    id: 'bur-03',
    category: 'burger',
    name: 'Burger Brasa',
    price: 35,
    available: true,
    tags: ['artesanal', 'especial'],
    imageUrl: '/4-fenix.webp',
    description: 'Pão comum, blend duplo de 80g, bacon crocante, queijo coalho tostado, banana-da-terra grelhada, alface e tomate.',
    ingredients: [
      'Pão comum artesanal',
      'Blend duplo de 80g',
      'Bacon crocante',
      'Queijo coalho',
      'Banana-da-terra grelhada',
      'Alface e tomate frescos',
    ],
  },
  {
    id: 'bur-04',
    category: 'burger',
    name: 'Burger Nefertari',
    price: 40,
    available: true,
    tags: ['especial da casa', 'artesanal'],
    imageUrl: '/2-kermet.webp',
    description: 'Pão comum, blend de 120g, queijo padrão minas, babaganush artesanal com tahine, picles de pepino, alface e tomate.',
    ingredients: [
      'Pão comum artesanal',
      'Blend de 120g',
      'Queijo padrão minas',
      'Babaganush com tahine',
      'Picles de pepino crocante',
      'Alface e tomate frescos',
    ],
  },

  // ─── WRAPS ──────────────────────────────────────────────────────────
  {
    id: 'wra-01',
    category: 'wrap',
    name: 'Wrap Fungi',
    price: 22,
    available: true,
    tags: ['vegano', 'artesanal'],
    imageUrl: '/wrap2-terra.webp',
    description: 'Cogumelos salteados no alho e ervas frescas, queijo vegano de aipim, picles de cebola roxa e alface lisa.',
    ingredients: [
      'Pão folha artesanal',
      'Cogumelos salteados no alho e ervas',
      'Queijo vegano de aipim',
      'Picles de cebola roxa',
      'Alface lisa fresca',
    ],
  },
  {
    id: 'wra-02',
    category: 'wrap',
    name: 'Wrap Levinho',
    price: 22,
    available: true,
    tags: ['artesanal', 'leve'],
    imageUrl: '/wrap1-salvia.webp',
    description: 'Frango em tiras grelhado, molho artesanal de mostarda e mel, picles de cebola roxa e alface lisa.',
    ingredients: [
      'Pão folha artesanal',
      'Frango em tiras grelhado',
      'Molho de mostarda e mel',
      'Picles de cebola roxa',
      'Alface lisa fresca',
    ],
  },

  // ─── TORTAS ARTESANAIS ─────────────────────────────────────────────
  {
    id: 'tor-01',
    category: 'torta',
    name: 'Torta Brócolis & Aipim (P)',
    price: 29,
    available: true,
    tags: ['artesanal', 'vegetariano', 'porção P'],
    description: 'Tamanho Individual (P). Massa amanteigada artesanal, brócolis temperado e requeijão cremoso de aipim.',
    ingredients: [
      'Massa amanteigada artesanal',
      'Brócolis temperado',
      'Requeijão cremoso de aipim',
    ],
  },
  {
    id: 'tor-02',
    category: 'torta',
    name: 'Torta Brócolis & Aipim (M)',
    price: 49,
    available: true,
    tags: ['artesanal', 'vegetariano', 'porção M'],
    description: 'Tamanho Médio (M / Compartilhar). Massa amanteigada artesanal, brócolis temperado e requeijão cremoso de aipim.',
    ingredients: [
      'Massa amanteigada artesanal',
      'Brócolis temperado',
      'Requeijão cremoso de aipim',
    ],
  },
  {
    id: 'tor-03',
    category: 'torta',
    name: 'Torta Carne Seca & Banana-da-Terra (P)',
    price: 39,
    available: true,
    tags: ['artesanal', 'especial', 'porção P'],
    description: 'Tamanho Individual (P). Massa amanteigada artesanal, carne seca desfiada, banana-da-terra e requeijão cremoso.',
    ingredients: [
      'Massa amanteigada artesanal',
      'Carne seca desfiada',
      'Banana-da-terra',
      'Requeijão cremoso',
    ],
  },
  {
    id: 'tor-04',
    category: 'torta',
    name: 'Torta Carne Seca & Banana-da-Terra (M)',
    price: 65,
    available: true,
    tags: ['artesanal', 'especial', 'porção M'],
    description: 'Tamanho Médio (M / Compartilhar). Massa amanteigada artesanal, carne seca desfiada, banana-da-terra e requeijão cremoso.',
    ingredients: [
      'Massa amanteigada artesanal',
      'Carne seca desfiada',
      'Banana-da-terra',
      'Requeijão cremoso',
    ],
  },

  // ─── ACOMPANHAMENTOS / BATATA FRITA ────────────────────────────────
  {
    id: 'sid-01',
    category: 'side',
    name: 'Batata Frita (Média)',
    price: 20,
    available: true,
    tags: ['vegano', 'porção M'],
    imageUrl: '/batatafrita.webp',
    images: ['/batatafrita.webp', '/batatafrita2.webp'],
    description: 'Porção Média (M). Crocante por fora, macia por dentro. Sal grosso e ervas frescas.',
    ingredients: ['Batatas selecionadas', 'Sal grosso', 'Ervas frescas'],
  },
  {
    id: 'sid-02',
    category: 'side',
    name: 'Batata Frita (Grande)',
    price: 30,
    available: true,
    tags: ['vegano', 'porção G'],
    imageUrl: '/batatafrita2.webp',
    images: ['/batatafrita2.webp', '/batatafrita.webp'],
    description: 'Porção Grande (G). Porção generosa para compartilhar. Batatas sequinhas e crocantes com toque de ervas.',
    ingredients: ['Batatas selecionadas', 'Sal grosso', 'Ervas frescas'],
  },

  // ─── BEBIDAS ───────────────────────────────────────────────────────
  {
    id: 'dri-01',
    category: 'drink',
    name: 'Refrigerante 1L',
    price: 10,
    available: true,
    tags: ['1 litro', 'gelado'],
    description: 'Garrafa 1 Litro gelada. Opções: Coca-Cola ou Guaraná Antarctica.',
  },
  {
    id: 'dri-02',
    category: 'drink',
    name: 'Refrigerante Lata',
    price: 7,
    available: true,
    tags: ['lata 350ml', 'gelado'],
    description: 'Lata 350ml gelada. Opções: Coca-Cola ou Guaraná Antarctica.',
  },
  {
    id: 'dri-03',
    category: 'drink',
    name: 'Suco Natural',
    price: 10,
    available: true,
    tags: ['natural', 'sem açúcar'],
    imageUrl: '/suco.webp',
    description: 'Laranja, limão ou abacaxi. Espremido na hora, sem açúcar adicionado.',
  },
  {
    id: 'dri-04',
    category: 'drink',
    name: 'Água Mineral',
    price: 4,
    available: true,
    tags: ['500ml', 'gelada'],
    description: 'Mineral 500ml gelada (sem gás ou com gás).',
  },
];

export const SEED_CATS: MenuCategory[] = [
  { id:'burger', label:'Pratos Principais',  sub:'Hambúrgueres artesanais',          roman:'I'   },
  { id:'wrap',   label:'Wraps',              sub:'Leves e intencionais',             roman:'II'  },
  { id:'torta',  label:'Tortas Artesanais',  sub:'Massa amanteigada e recheios generosos', roman:'III' },
  { id:'side',   label:'Acompanhamentos',    sub:'Para completar',                   roman:'IV'  },
  { id:'drink',  label:'Bebidas',            sub:'Frescas e geladas',                roman:'V'   },
];

// Merge seed photos into existing KV items that don't yet have imageUrl set.
function mergePhotos(stored: MenuItem[]): MenuItem[] {
  const photoMap = new Map(SEED_ITEMS.map(s => [s.id, { imageUrl: s.imageUrl, images: s.images }]));
  return stored.map(item => {
    if (!item.imageUrl) {
      const seed = photoMap.get(item.id);
      if (seed) return { ...item, imageUrl: seed.imageUrl, images: seed.images };
    }
    return item;
  });
}

// GET — returns { items, categories }
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const [items, cats] = await Promise.all([
    env.NEFERTARI_KV.get(MENU_KEY, { type: 'json' }),
    env.NEFERTARI_KV.get(CATS_KEY, { type: 'json' }),
  ]);
  const storedItems = items as MenuItem[] | null;
  // Use seed when KV is empty; otherwise merge photos into existing items
  const resolvedItems = storedItems ? mergePhotos(storedItems) : SEED_ITEMS;
  return Response.json(
    { items: resolvedItems,
      categories: (cats as MenuCategory[] | null) ?? SEED_CATS },
    { headers: cors() }
  );
};

// POST — full replace of items + categories (admin panel)
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as { items: MenuItem[]; categories?: MenuCategory[] };
    await Promise.all([
      env.NEFERTARI_KV.put(MENU_KEY, JSON.stringify(body.items)),
      body.categories
        ? env.NEFERTARI_KV.put(CATS_KEY, JSON.stringify(body.categories))
        : Promise.resolve(),
    ]);
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
