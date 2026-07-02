interface StrapiUploadFile {
  id: number
  url: string
  alternativeText?: string | null
  createdAt?: string
}

interface RuntimeConfigWithStrapi {
  public: {
    strapiUrl: string
  }
  strapiToken: string
}

const ACTIVE_SUFFIX = ':active'
const INACTIVE_SUFFIX = ':inactive'

function adminHeaders(config: RuntimeConfigWithStrapi) {
  return { Authorization: `Bearer ${config.strapiToken}` }
}

export function profileAvatarMarker(userId: number, active = true): string {
  return `iberia-profile-avatar:${userId}${active ? ACTIVE_SUFFIX : INACTIVE_SUFFIX}`
}

export function absoluteStrapiUrl(config: RuntimeConfigWithStrapi, url: string): string {
  return url.startsWith('http') ? url : new URL(url, config.public.strapiUrl).toString()
}

async function fetchAvatarFiles(config: RuntimeConfigWithStrapi, marker: string): Promise<StrapiUploadFile[]> {
  const params = new URLSearchParams({
    'filters[alternativeText][$eq]': marker,
    'sort[0]': 'createdAt:desc',
    'pagination[pageSize]': '100',
  })

  return await $fetch<StrapiUploadFile[]>(`${config.public.strapiUrl}/api/upload/files?${params}`, {
    headers: adminHeaders(config),
  })
}

async function updateFileInfo(config: RuntimeConfigWithStrapi, fileId: number, fileInfo: Record<string, unknown>): Promise<void> {
  const data = new FormData()
  data.append('fileInfo', JSON.stringify(fileInfo))

  await $fetch(`${config.public.strapiUrl}/api/upload?id=${fileId}`, {
    method: 'POST',
    headers: adminHeaders(config),
    body: data,
  })
}

export async function getStoredProfileAvatar(config: RuntimeConfigWithStrapi, userId: number): Promise<string | null> {
  const files = await fetchAvatarFiles(config, profileAvatarMarker(userId))
  return files[0]?.url ? absoluteStrapiUrl(config, files[0].url) : null
}

export async function clearStoredProfileAvatar(config: RuntimeConfigWithStrapi, userId: number): Promise<void> {
  const activeFiles = await fetchAvatarFiles(config, profileAvatarMarker(userId))
  await Promise.all(
    activeFiles.map(file =>
      updateFileInfo(config, file.id, { alternativeText: profileAvatarMarker(userId, false) }),
    ),
  )
}

export async function setStoredProfileAvatar(config: RuntimeConfigWithStrapi, userId: number, fileId: number): Promise<void> {
  await clearStoredProfileAvatar(config, userId)
  await updateFileInfo(config, fileId, { alternativeText: profileAvatarMarker(userId) })
}
