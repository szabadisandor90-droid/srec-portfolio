export const config = { runtime: 'edge' };

const BASE = 'https://github.com/szabadisandor90-droid/srec-portfolio/releases/download/v1.0-assets/';

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const v = searchParams.get('v');
  if (!v) return new Response('Missing param', { status: 400 });

  const githubUrl = BASE + encodeURIComponent(v);

  // Step 1: get the real CDN URL (don't follow redirect yet)
  const redirectRes = await fetch(githubUrl, { redirect: 'manual' });
  const cdnUrl = redirectRes.headers.get('location');

  if (!cdnUrl) {
    return new Response('Video not found', { status: 404 });
  }

  // Step 2: make the actual request to CDN, forwarding Range header
  const upstreamHeaders = {};
  const range = req.headers.get('range');
  if (range) upstreamHeaders['range'] = range;

  const upstream = await fetch(cdnUrl, { headers: upstreamHeaders });

  const resHeaders = new Headers();
  resHeaders.set('Content-Type', 'video/mp4');
  resHeaders.set('Accept-Ranges', 'bytes');
  resHeaders.set('Access-Control-Allow-Origin', '*');
  resHeaders.set('Cache-Control', 'public, max-age=300');

  const cl = upstream.headers.get('content-length');
  const cr = upstream.headers.get('content-range');
  if (cl) resHeaders.set('Content-Length', cl);
  if (cr) resHeaders.set('Content-Range', cr);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}
