import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const FORUM_ENTRY_MARKER = '__FORUM_POST__'

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env')
  const env = {}

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#][^=]+)=(.*)$/)
    if (match) env[match[1].trim()] = match[2].trim()
  }

  return env
}

const env = loadEnv()
const base = env.STRAPI_URL?.replace(/\/$/, '')
const token = env.STRAPI_TOKEN

if (!base || !token) {
  throw new Error('Missing STRAPI_URL or STRAPI_TOKEN in .env')
}

const headers = {
  Authorization: `Bearer ${token}`,
}

async function request(path) {
  const response = await fetch(`${base}${path}`, { headers })
  const text = await response.text()
  const body = text ? JSON.parse(text) : null

  return {
    ok: response.ok,
    status: response.status,
    message: body?.error?.message ?? response.statusText,
    body,
  }
}

async function endpointStatus(path) {
  const response = await request(path)
  return {
    path,
    ok: response.ok,
    status: response.status,
    message: response.message,
    count: Array.isArray(response.body?.data) ? response.body.data.length : null,
  }
}

async function main() {
  const endpoints = [
    '/api/forum-categories?pagination[pageSize]=1',
    '/api/forum-posts?pagination[pageSize]=1',
    '/api/forum-comments?pagination[pageSize]=1',
    '/api/forum-likes?pagination[pageSize]=1',
  ]

  const statuses = await Promise.all(endpoints.map(endpointStatus))

  console.log('Forum endpoint status:')
  for (const item of statuses) {
    console.log(`${item.ok ? 'OK' : 'FAIL'} ${item.status} ${item.path}${item.ok ? '' : ` - ${item.message}`}`)
  }

  const allReady = statuses.every(item => item.ok)
  if (!allReady) {
    console.log('')
    console.log('Forum content types are not live yet. Deploy/restart Strapi before migration.')
    process.exit(1)
  }

  const legacy = await request(`/api/entradas?pagination[pageSize]=100&filters[excerpt][$eq]=${encodeURIComponent(FORUM_ENTRY_MARKER)}`)
  const migrated = await request('/api/forum-posts?fields[0]=legacyDocumentId&pagination[pageSize]=1000')

  const legacyIds = new Set((legacy.body?.data ?? []).map(item => item.documentId).filter(Boolean))
  const migratedLegacyIds = new Set((migrated.body?.data ?? []).map(item => item.legacyDocumentId).filter(Boolean))
  const pending = [...legacyIds].filter(id => !migratedLegacyIds.has(id))

  console.log('')
  console.log(`Legacy Entrada forum posts: ${legacyIds.size}`)
  console.log(`Migrated forum posts: ${migratedLegacyIds.size}`)
  console.log(`Pending migration: ${pending.length}`)

  if (pending.length) {
    console.log('')
    console.log('Next command:')
    console.log('npm run forum:migrate')
    return
  }

  console.log('')
  console.log('Migration appears complete. Next step is end-to-end forum testing before removing legacy fallback.')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
