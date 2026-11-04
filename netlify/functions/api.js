export const config = {
  path: '/api/*'
}

const defaultApiOrigin = 'https://code-pixel-webapp.onrender.com'

const hopByHopHeaders = [
  'connection',
  'content-encoding',
  'content-length',
  'host',
  'keep-alive',
  'origin',
  'referer',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade'
]

export default async function handler(request) {
  const apiOrigin = process.env.API_URL || defaultApiOrigin

  let upstreamUrl
  try {
    const apiBase = new URL(apiOrigin)
    if (!['http:', 'https:'].includes(apiBase.protocol) || apiBase.pathname !== '/' || apiBase.search || apiBase.hash) {
      return Response.json({ error: 'API_URL must be the API origin, without a path' }, { status: 500 })
    }
    upstreamUrl = new URL(`${new URL(request.url).pathname}${new URL(request.url).search}`, apiBase)
  } catch (error) {
    console.error('Invalid API_URL configuration', error)
    return Response.json({ error: 'Invalid API_URL configuration' }, { status: 500 })
  }

  const headers = new Headers(request.headers)
  for (const header of hopByHopHeaders) headers.delete(header)

  try {
    const hasBody = request.method !== 'GET' && request.method !== 'HEAD'
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      ...(hasBody ? { body: await request.arrayBuffer() } : {})
    })
    const responseHeaders = new Headers(upstream.headers)
    for (const header of hopByHopHeaders) responseHeaders.delete(header)
    const body = request.method === 'HEAD' || upstream.status === 204 || upstream.status === 304
      ? null
      : await upstream.arrayBuffer()

    return new Response(body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders
    })
  } catch (error) {
    console.error('Netlify API proxy request failed', error)
    return Response.json({ error: 'Unable to reach the API service' }, { status: 502 })
  }
}
