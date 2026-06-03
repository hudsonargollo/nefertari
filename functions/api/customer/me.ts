interface Env { NEFERTARI_KV: KVNamespace; }

async function resolvePhone(env: Env, token: string): Promise<string|null> {
  const d = await env.NEFERTARI_KV.get(`auth:${token}`, { type:'json' }) as { phone:string; expires:number }|null;
  if (!d || Date.now() > d.expires) return null;
  return d.phone;
}

// GET — customer profile (loyalty, history, reward status)
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const token = request.headers.get('X-Auth-Token') ?? new URL(request.url).searchParams.get('token') ?? '';
  const phone = await resolvePhone(env, token);
  if (!phone) return Response.json({ error:'unauthorized' }, { status:401, headers:cors() });

  const raw = await env.NEFERTARI_KV.get(`crm:${phone}`, { type:'json' }) as Record<string,unknown>|null;
  if (!raw) return Response.json({ error:'not_found' }, { status:404, headers:cors() });

  // strip pin hash from response
  const { pinHash: _ph, ...safe } = raw as Record<string,unknown> & { pinHash?:string };

  // attach active reward if pending
  let reward = null;
  if (safe.pendingReward) {
    reward = await env.NEFERTARI_KV.get('rewards:active', { type:'json' });
  }

  return Response.json({ ...safe, reward }, { headers:cors() });
};

// POST — claim reward (sets pendingReward=false, increments totalCycles)
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const token  = request.headers.get('X-Auth-Token') ?? '';
  const phone  = await resolvePhone(env, token);
  if (!phone) return Response.json({ error:'unauthorized' }, { status:401, headers:cors() });

  const { action } = await request.json() as { action:string };

  const raw = await env.NEFERTARI_KV.get(`crm:${phone}`, { type:'json' }) as Record<string,unknown>|null;
  if (!raw) return Response.json({ error:'not_found' }, { status:404, headers:cors() });

  if (action === 'claim_reward') {
    const activeReward = await env.NEFERTARI_KV.get('rewards:active', { type:'json' }) as { id:string }|null;
    const claimed = (raw.claimedRewardIds as string[]) ?? [];
    const updated = {
      ...raw,
      pendingReward: false,
      claimedRewardIds: activeReward ? [...claimed, activeReward.id] : claimed,
    };
    await env.NEFERTARI_KV.put(`crm:${phone}`, JSON.stringify(updated));
    return Response.json({ ok:true }, { headers:cors() });
  }

  return Response.json({ ok:false, error:'unknown_action' }, { headers:cors() });
};

export const onRequestOptions: PagesFunction = async () => new Response(null, { headers:cors() });

function cors() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
  };
}
