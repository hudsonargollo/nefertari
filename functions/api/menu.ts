interface Env { NEFERTARI_KV: KVNamespace; }

export interface MenuItem {
  id:          string;
  category:    string;
  name:        string;
  description: string;
  price:       number;
  available:   boolean;
  tags:        string[];
  imageUrl?:   string;           // primary photo (base64 or URL)
  images?:     string[];         // multiple photos (e.g. two angles for batata frita)
}

export interface MenuCategory {
  id:     string;
  label:  string;
  sub:    string;
  roman:  string;
}

const MENU_KEY = 'menu:items';
const CATS_KEY = 'menu:categories';

const SEED_ITEMS: MenuItem[] = [
  { id:'bur-01', category:'burger', name:'Pirâmide', price:28, available:true,
    tags:['vegano'], imageUrl:'/1-piramide.webp',
    description:'Grão de bico artesanal, húmus, folhas frescas, tomate e molho de ervas ao azeite.' },
  { id:'bur-02', category:'burger', name:'Kemet',    price:30, available:true,
    tags:['vegano'], imageUrl:'/2-kermet.webp',
    description:'Soja texturizada, babaganoush, rúcula, cebola caramelizada e mostarda dijon.' },
  { id:'bur-03', category:'burger', name:'Nilo',     price:28, available:true,
    tags:['vegano'], imageUrl:'/3-nilo.webp',
    description:'Lentilha, cream cheese de castanhas, alface, pepino e molho de iogurte.' },
  { id:'bur-04', category:'burger', name:'Fênix',    price:32, available:true,
    tags:[], imageUrl:'/4-fenix.webp',
    description:'Frango grelhado, crispy de cebola, pimenta roxa e aioli de limão siciliano.' },
  { id:'wra-01', category:'wrap',   name:'Sálvia',   price:26, available:true,
    tags:[], imageUrl:'/wrap1-salvia.webp',
    description:'Frango grelhado, mix de folhas, húmus artesanal, azeite de ervas e limão.' },
  { id:'wra-02', category:'wrap',   name:'Terra',    price:24, available:true,
    tags:['vegano'], imageUrl:'/wrap2-terra.webp',
    description:'Grão de bico assado, legumes no forno, tahine caseiro e rúcula.' },
  { id:'sid-01', category:'side',   name:'Batata frita', price:12, available:true,
    tags:['vegano'], imageUrl:'/batatafrita.webp',
    images:['/batatafrita.webp', '/batatafrita2.webp'],
    description:'Crocante por fora, macia por dentro. Sal grosso e ervas frescas.' },
  { id:'dri-01', category:'drink',  name:'Suco natural', price:10, available:true,
    tags:['vegano'], description:'Laranja, limão ou abacaxi. Espremido na hora, sem açúcar adicionado.' },
  { id:'dri-02', category:'drink',  name:'Refrigerante', price:6,  available:true,
    tags:[], description:'Lata gelada.' },
  { id:'dri-03', category:'drink',  name:'Água',     price:4,  available:true,
    tags:[], description:'Mineral sem gás 500ml.' },
];

// Merge seed photos into existing KV items that don't yet have imageUrl set.
// This lets the seed apply retroactively without wiping admin edits.
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

const SEED_CATS: MenuCategory[] = [
  { id:'burger', label:'Pratos Principais',  sub:'Hambúrgueres artesanais',  roman:'I'   },
  { id:'wrap',   label:'Wraps',              sub:'Leves e intencionais',      roman:'II'  },
  { id:'side',   label:'Acompanhamentos',    sub:'Para completar',            roman:'III' },
  { id:'drink',  label:'Bebidas',            sub:'Frescas e simples',         roman:'IV'  },
];

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
