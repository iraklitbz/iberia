import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
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
  const response = await request(
    `/api/entradas?pagination[page]=1&pagination[pageSize]=1000&sort=updatedAt:DESC&filters[excerpt][$eq]=${encodeURIComponent(FORUM_ENTRY_MARKER)}`,
  )

  const exportedAt = new Date().toISOString()
  const data = {
    exportedAt,
    source: `${base}/api/entradas`,
    marker: FORUM_ENTRY_MARKER,
    count: response.data?.length ?? 0,
    entries: response.data ?? [],
  }

  mkdirSync(resolve(process.cwd(), 'tmp'), { recursive: true })
  const filename = `legacy-forum-export-${exportedAt.replace(/[:.]/g, '-')}.json`
  const outputPath = resolve(process.cwd(), 'tmp', filename)
  writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`)

  console.log(`Exported ${data.count} legacy forum entries`)
  console.log(outputPath)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
