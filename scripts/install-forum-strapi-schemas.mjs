import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'

const targetRoot = process.argv[2]

if (!targetRoot) {
  console.error('Usage: node scripts/install-forum-strapi-schemas.mjs <strapi-backend-path>')
  process.exit(1)
}

const backendRoot = resolve(targetRoot)
const sourceRoot = resolve(process.cwd(), 'strapi/forum-content-types')

if (!existsSync(backendRoot)) {
  console.error(`Strapi backend path does not exist: ${backendRoot}`)
  process.exit(1)
}

if (!existsSync(join(backendRoot, 'src'))) {
  console.error(`Path does not look like a Strapi backend. Missing src directory: ${backendRoot}`)
  process.exit(1)
}

function copyDirectory(sourceDir, targetDir) {
  for (const entry of readdirSync(sourceDir)) {
    const source = join(sourceDir, entry)
    const target = join(targetDir, entry)

    if (statSync(source).isDirectory()) {
      mkdirSync(target, { recursive: true })
      copyDirectory(source, target)
      continue
    }

    mkdirSync(dirname(target), { recursive: true })
    copyFileSync(source, target)
    console.log(`Installed ${relative(backendRoot, target)}`)
  }
}

for (const apiName of readdirSync(sourceRoot)) {
  const source = join(sourceRoot, apiName)
  if (!statSync(source).isDirectory()) continue

  const target = join(backendRoot, 'src/api', basename(apiName))
  mkdirSync(target, { recursive: true })
  copyDirectory(source, target)
}

console.log('Done. Commit/deploy these files and restart Strapi.')
