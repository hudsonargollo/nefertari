interface Env { NEFERTARI_KV: KVNamespace; }

interface SeasonalReward {
  id:          string;
  seasonName:  string;
  recipeTitle: string;
  recipeDescription: string;
  imageUrl?:   string;
  isActive:    boolean;
  createdAt:   string;
}

const LIST_KEY   = 'rewards:list';
const ACTIVE_KEY = 'rewards:active';

// GET — list all rewards
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const list = (await env.NEFERTARI_KV.get(LIST_KEY, { type:'json' }) as SeasonalReward[]|null) ?? [];
  return Response.json(list, { headers:cors() });
};

// POST — create or update reward; setting isActive=true replaces the active one
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as Partial<SeasonalReward> & { id?:string };
    const list = (await env.NEFERTARI_KV.get(LIST_KEY, { type:'json' }) as SeasonalReward[]|null) ?? [];

    const existing = body.id ? list.find(r => r.id === body.id) : null;
    const reward: SeasonalReward = {
      id:                existing?.id ?? crypto.randomUUID(),
      seasonName:        body.seasonName        ?? existing?.seasonName        ?? '',
      recipeTitle:       body.recipeTitle        ?? existing?.recipeTitle        ?? '',
      recipeDescription: body.recipeDescription ?? existing?.recipeDescription ?? '',
      imageUrl:          body.imageUrl           ?? existing?.imageUrl,
      isActive:          body.isActive           ?? existing?.isActive ?? false,
      createdAt:         existing?.createdAt ?? new Date().toISOString(),
    };

    const next = existing
      ? list.map(r => r.id === reward.id ? reward : (reward.isActive ? { ...r, isActive:false } : r))
      : [reward, ...list.map(r => reward.isActive ? { ...r, isActive:false } : r)];

    await env.NEFERTARI_KV.put(LIST_KEY, JSON.stringify(next));
    if (reward.isActive) await env.NEFERTARI_KV.put(ACTIVE_KEY, JSON.stringify(reward));

    return Response.json({ ok:true, reward }, { headers:cors() });
  } catch {
    return Response.json({ ok:false }, { status:400, headers:cors() });
  }
};

// DELETE /api/rewards?id=xxx
export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  const id   = new URL(request.url).searchParams.get('id');
  const list = (await env.NEFERTARI_KV.get(LIST_KEY, { type:'json' }) as SeasonalReward[]|null) ?? [];
  const next = list.filter(r => r.id !== id);
  await env.NEFERTARI_KV.put(LIST_KEY, JSON.stringify(next));

  // if deleted was active, clear active
  const active = await env.NEFERTARI_KV.get(ACTIVE_KEY, { type:'json' }) as SeasonalReward|null;
  if (active?.id === id) await env.NEFERTARI_KV.delete(ACTIVE_KEY);

  return Response.json({ ok:true }, { headers:cors() });
};

// GET /api/rewards/active — public endpoint for customers
export const onRequestOptions: PagesFunction = async () => new Response(null, { headers:cors() });

function cors() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
