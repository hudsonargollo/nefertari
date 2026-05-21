interface Env { NEFERTARI_KV: KVNamespace; }

const KEY = 'milestone01:feedback';

interface FileMeta  { name: string; type: string; size: number; }
interface FileEntry extends FileMeta { data: string; }

interface Feedback {
  mc_identity : string;
  mc_palette  : string;
  mc_voice    : string;
  q_tocou     : string;
  q_mudaria   : string;
  links       : string[];
  files       : FileEntry[];
  updated_at  : string;
}

// GET — return text data + file metadata (strip binary for fast response)
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const raw = await env.NEFERTARI_KV.get(KEY, { type: 'json' }) as Feedback | null;
  if (!raw) return Response.json(null, { headers: cors() });
  const { files, ...rest } = raw;
  return Response.json(
    { ...rest, files: (files ?? []).map(({ name, type, size }) => ({ name, type, size })) },
    { headers: cors() },
  );
};

// POST — save everything including file base64 data
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json() as Omit<Feedback, 'updated_at'>;
    await env.NEFERTARI_KV.put(KEY, JSON.stringify({
      ...body,
      updated_at: new Date().toISOString(),
    }));
    return Response.json({ ok: true }, { headers: cors() });
  } catch {
    return Response.json({ ok: false, error: 'Invalid payload' }, { status: 400, headers: cors() });
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
