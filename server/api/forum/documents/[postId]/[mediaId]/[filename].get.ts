function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;,]+)?(;base64)?,(.*)$/)
  if (!match) {
    throw createError({ statusCode: 415, message: 'Unsupported document source' })
  }

  const mimeType = match[1] || 'application/octet-stream'
  const data = match[2]
    ? Buffer.from(match[3], 'base64')
    : Buffer.from(decodeURIComponent(match[3]), 'utf8')

  return { data, mimeType }
}

function contentDispositionFilename(name: string) {
  const fallback = name
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/["\\\r\n]/g, '_')
    || 'document'
  const encoded = encodeURIComponent(name)

  return `inline; filename="${fallback}"; filename*=UTF-8''${encoded}`
}

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'postId')
  const mediaId = getRouterParam(event, 'mediaId')

  if (!postId || !mediaId) {
    throw createError({ statusCode: 400, message: 'Missing document id' })
  }

  const entry = await getForumEntry(event, postId)
  const media = forumDocumentItemsFromEntry(entry).find((item) => String(item.id) === mediaId)

  if (!media || typeof media !== 'object') {
    throw createError({ statusCode: 404, message: 'Document not found' })
  }

  const document = media as { src?: unknown, name?: unknown }
  const src = typeof document.src === 'string' ? document.src : ''
  const name = typeof document.name === 'string' && document.name ? document.name : 'document'

  if (!src) {
    throw createError({ statusCode: 404, message: 'Document not found' })
  }

  if (!src.startsWith('data:')) {
    return sendRedirect(event, src, 302)
  }

  const { data, mimeType } = parseDataUrl(src)

  setHeader(event, 'Cache-Control', 'private, max-age=300')
  setHeader(event, 'Content-Type', mimeType)
  setHeader(event, 'Content-Length', String(data.length))
  setHeader(event, 'Content-Disposition', contentDispositionFilename(name))

  return data
})
