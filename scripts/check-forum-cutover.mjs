import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const FORUM_ENTRY_MARKER = '__FORUM_POST__'

function loadEnv() {
  const env = {}
  const envPath = resolve(process.cwd(), '.env')

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

async function request(path) {
  const response = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const text = await response.text()
  const body = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status} ${body?.error?.message ?? response.statusText}`)
  }

  return body
}

async function main() {
  const legacy = await request(`/api/entradas?pagination[pageSize]=1000&filters[excerpt][$eq]=${encodeURIComponent(FORUM_ENTRY_MARKER)}`)
  const forum = await request('/api/forum-posts?fields[0]=legacyDocumentId&pagination[pageSize]=1000')

  const legacyIds = new Set((legacy.data ?? []).map(item => item.documentId).filter(Boolean))
  const migratedIds = new Set((forum.data ?? []).map(item => item.legacyDocumentId).filter(Boolean))
  const pending = [...legacyIds].filter(id => !migratedIds.has(id))

  console.log(`Legacy forum posts: ${legacyIds.size}`)
  console.log(`Migrated legacy posts: ${migratedIds.size}`)
  console.log(`Pending legacy posts: ${pending.length}`)

  if (pending.length) {
    console.log('')
    console.log('Do not disable FORUM_LEGACY_FALLBACK yet.')
    process.exit(1)
  }

  console.log('')
  console.log('Cutover check passed. You can set FORUM_LEGACY_FALLBACK=false after end-to-end forum testing.')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
