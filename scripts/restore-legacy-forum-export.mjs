import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const exportPath = process.argv[2]
const APPLY = process.argv.includes('--apply')

if (!exportPath) {
  console.error('Usage: node scripts/restore-legacy-forum-export.mjs <export-json-path> [--apply]')
  process.exit(1)
}

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

const backup = JSON.parse(readFileSync(resolve(exportPath), 'utf8'))
const entries = Array.isArray(backup.entries) ? backup.entries : []

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })
  const text = await response.text()
  const body = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(`${options.method ?? 'GET'} ${path} failed: ${response.status} ${body?.error?.message ?? response.statusText}`)
  }

  return body
}

function restoredData(entry) {
  return {
    title: entry.title,
    slug: entry.slug || `restored-forum-${entry.documentId}`,
    content: typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content ?? {}),
    excerpt: entry.excerpt,
    acceso: entry.acceso || 'publico',
    publishedAt: entry.publishedAt || new Date().toISOString(),
  }
}

async function main() {
  console.log(`Backup entries: ${entries.length}`)

  if (!APPLY) {
    console.log('Dry run only. Re-run with --apply to recreate Entrada records from this backup.')
    return
  }

  for (const entry of entries) {
    const response = await request('/api/entradas?status=published', {
      method: 'POST',
      body: JSON.stringify({ data: restoredData(entry) }),
    })
    console.log(`Restored ${entry.documentId} -> ${response.data?.documentId}`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
