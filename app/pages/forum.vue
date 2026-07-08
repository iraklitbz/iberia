<template>
  <div class="min-h-screen bg-zinc-50 pt-16">
    <section class="border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-[96rem] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <h1 class="sr-only">{{ t('forum.title') }}</h1>

        <nav
          class="flex w-full flex-wrap items-stretch gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-1 shadow-sm lg:w-auto lg:min-w-[38rem] xl:ml-4"
          aria-label="Forum menu"
        >
          <NuxtLink
            v-for="item in forumMenuItems"
            :key="item.key"
            :to="forumMenuLink(item)"
            class="inline-flex min-h-14 flex-1 flex-col items-center justify-center rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors"
            :class="activeForumMenu === item.key ? 'bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200' : 'text-zinc-600 hover:bg-white/70 hover:text-zinc-950'"
          >
            <span>{{ item.label }}</span>
            <span class="mt-0.5 text-[11px] font-medium leading-none text-zinc-400">
              {{ item.subtitle }}
            </span>
          </NuxtLink>
        </nav>

        <div class="flex flex-1 flex-col gap-3 lg:max-w-5xl lg:flex-row lg:items-center lg:justify-end">
          <div class="relative w-full lg:max-w-xl">
            <svg class="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              v-model.trim="search"
              type="search"
              class="h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-12 pr-4 text-sm text-zinc-800 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              :placeholder="t('forum.search')"
            />
          </div>

          <div class="flex items-center justify-between gap-4 lg:justify-end">
            <div
              class="flex size-11 items-center justify-center rounded-full font-bold"
              :class="isAuthenticated ? 'bg-iberia text-white' : 'bg-zinc-200 text-zinc-500'"
            >
              <img
                v-if="isAuthenticated && profileAvatar"
                :src="profileAvatar"
                :alt="user?.username ?? ''"
                class="size-11 rounded-full object-cover"
              />
              <span v-else-if="isAuthenticated">{{ userInitial }}</span>
              <svg v-else class="size-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
              </svg>
            </div>

            <button
              type="button"
              class="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700"
              @click="showComposer = !showComposer"
            >
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {{ t('forum.newPost') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <form
        v-if="showComposer"
        class="mb-8 grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
        @submit.prevent="addPost"
      >
        <input
          v-model.trim="form.title"
          type="text"
          class="h-11 rounded-lg border border-zinc-200 px-4 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          :placeholder="t('forum.postTitle')"
        />
        <textarea
          v-model.trim="form.message"
          rows="4"
          class="resize-none rounded-lg border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          :placeholder="t('forum.writePost')"
        />
        <div class="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4">
          <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm ring-1 ring-zinc-200 transition hover:text-violet-700 hover:ring-violet-300">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {{ t('forum.photoVideo') }}
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              class="sr-only"
              @change="handleMediaUpload"
            />
          </label>

          <div v-if="form.media.length" class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="media in form.media"
              :key="media.id"
              class="relative overflow-hidden rounded-lg border border-zinc-200 bg-white"
            >
              <img
                v-if="media.type === 'image'"
                :src="media.src"
                :alt="media.name"
                class="h-36 w-full object-cover"
              />
              <video
                v-else
                :src="media.src"
                class="h-36 w-full object-cover"
                muted
                controls
              />
              <button
                type="button"
                class="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-sm transition hover:text-red-600"
                @click="removeMedia(media.id)"
              >
                <span class="sr-only">{{ t('forum.removeMedia') }}</span>
                <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <p v-if="publishError" class="mr-auto self-center text-sm font-medium text-red-600">
            {{ publishError }}
          </p>
          <button type="button" class="rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50" @click="cancelComposer">
            {{ t('forum.cancel') }}
          </button>
          <button
            type="submit"
            class="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
            :disabled="uploadingMedia || publishingPost"
          >
            {{ t('forum.publish') }}
          </button>
        </div>
      </form>

      <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-xl font-bold text-zinc-950">{{ t('forum.latestPosts') }}</h2>
        <select
          v-model="sortBy"
          class="h-11 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        >
          <option value="newest">{{ t('forum.sortNewest') }}</option>
          <option value="popular">{{ t('forum.sortPopular') }}</option>
          <option value="comments">{{ t('forum.sortComments') }}</option>
        </select>
      </div>

      <div class="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <article
          v-for="post in visiblePosts"
          :key="post.id"
          class="grid gap-5 border-b border-zinc-200 p-5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_220px_180px] md:items-center lg:p-6"
        >
          <div class="flex min-w-0 gap-5">
            <div
              class="flex size-12 shrink-0 items-center justify-center rounded-full text-xl font-semibold text-white shadow-sm"
              :class="post.avatarClass"
            >
              <img
                v-if="post.avatarUrl"
                :src="post.avatarUrl"
                :alt="post.name"
                class="size-12 rounded-full object-cover"
              />
              <span v-else>{{ post.initial }}</span>
            </div>

            <div class="min-w-0">
              <h3 v-if="post.title" class="text-lg font-extrabold leading-snug text-zinc-950">{{ post.title }}</h3>
              <p class="line-clamp-2 text-sm leading-6 text-zinc-600" :class="post.title ? 'mt-3' : ''">{{ post.message }}</p>
              <span
                v-if="post.category"
                class="mt-4 inline-flex rounded-md px-3 py-1 text-sm font-semibold"
                :class="categoryClass(post.category)"
              >
                {{ post.category }}
              </span>
              <div v-if="post.media?.length" class="mt-4 grid gap-3 sm:grid-cols-2">
                <div
                  v-for="media in post.media"
                  :key="media.id"
                  class="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
                >
                  <img
                    v-if="media.type === 'image'"
                    :src="media.src"
                    :alt="media.name"
                    class="max-h-80 w-full object-cover"
                    loading="lazy"
                  />
                  <video
                    v-else
                    :src="media.src"
                    class="max-h-80 w-full bg-black"
                    controls
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="hidden md:block">
            <img
              v-if="post.image"
              :src="post.image"
              :alt="post.title"
              class="h-[110px] w-full rounded-md object-cover"
              loading="lazy"
            />
          </div>

          <div class="grid grid-cols-3 items-center gap-3 text-sm text-zinc-700 md:grid-cols-2">
            <button
              type="button"
              class="relative flex items-center gap-2 rounded-md transition hover:text-violet-700"
              @click="toggleComments(post.id)"
            >
              <span class="relative inline-flex size-5">
                <svg class="size-5 text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
                </svg>
                <span
                  v-if="unreadCommentCount(post)"
                  class="absolute -right-1 -top-1 size-2.5 rounded-full border border-white bg-red-600"
                />
              </span>
              {{ post.commentItems.length }}
            </button>
            <button
              type="button"
              class="flex items-center gap-2 rounded-md transition hover:text-red-600"
              :class="hasLikedPost(post) ? 'text-red-600' : 'text-zinc-700'"
              @click="likePost(post)"
            >
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                :fill="hasLikedPost(post) ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
              {{ post.likes }}
            </button>
            <time class="text-zinc-500 md:col-span-2 md:mt-4" :datetime="post.createdAt">
              {{ relativeDate(post.createdAt) }}
            </time>
            <button
              v-if="canDeletePost(post)"
              type="button"
              class="flex items-center gap-2 rounded-md text-red-500 transition hover:text-red-700 md:col-span-2"
              @click="deletePost(post.id)"
            >
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v5M14 11v5" />
              </svg>
              {{ t('forum.deletePost') }}
            </button>
          </div>

          <div
            v-if="openCommentsPostId === post.id"
            class="border-t border-zinc-100 pt-5 md:col-span-3"
          >
            <div v-if="post.commentItems.length" class="space-y-3">
              <div
                v-for="comment in post.commentItems"
                :key="comment.id"
                class="flex gap-3 rounded-lg bg-zinc-50 px-4 py-3"
              >
                <div
                  class="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm"
                  :class="comment.avatarClass"
                >
                  <img
                    v-if="comment.avatarUrl"
                    :src="comment.avatarUrl"
                    :alt="comment.name"
                    class="size-9 rounded-full object-cover"
                  />
                  <span v-else>{{ comment.initial }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-zinc-900">{{ comment.name }}</p>
                  <p class="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-700">{{ comment.message }}</p>
                  <time class="mt-2 block text-xs text-zinc-400" :datetime="comment.createdAt">
                    {{ relativeDate(comment.createdAt) }}
                  </time>
                </div>
                <button
                  v-if="canDeleteComment(comment)"
                  type="button"
                  class="flex size-8 shrink-0 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 hover:text-red-700"
                  :aria-label="t('forum.deletePost')"
                  @click="deleteComment(post, comment.id)"
                >
                  <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v5M14 11v5" />
                  </svg>
                </button>
              </div>
            </div>

            <p v-else class="text-sm text-zinc-500">{{ t('forum.noComments') }}</p>

            <form class="mt-4 flex flex-col gap-3 sm:flex-row" @submit.prevent="addComment(post)">
              <input
                v-model.trim="commentForms[post.id]"
                type="text"
                class="h-11 flex-1 rounded-lg border border-zinc-200 px-4 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                :placeholder="t('forum.writeComment')"
              />
              <button
                type="submit"
                class="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="!commentForms[post.id]"
              >
                {{ t('forum.send') }}
              </button>
            </form>
          </div>
        </article>

        <div v-if="!visiblePosts.length" class="px-6 py-14 text-center">
          <h3 class="text-lg font-bold text-zinc-900">{{ t('forum.noPostsTitle') }}</h3>
          <p class="mt-2 text-sm text-zinc-500">{{ t('forum.noPostsText') }}</p>
        </div>
      </div>

      <nav class="mt-6 flex items-center justify-center gap-2" :aria-label="t('forum.pages')">
        <button
          v-for="page in pages"
          :key="page"
          type="button"
          class="flex size-10 items-center justify-center rounded-md border text-sm font-semibold transition"
          :class="page === currentPage ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-zinc-200 bg-white text-zinc-800 hover:border-violet-300'"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <span class="px-2 text-zinc-600">...</span>
        <button type="button" class="flex size-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-sm font-semibold text-zinc-800 transition hover:border-violet-300">
          15
        </button>
        <button type="button" class="flex size-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-800 transition hover:border-violet-300" :aria-label="t('next')">
          <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </nav>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', headerSolid: true, middleware: ['auth', 'subscriber'] })

type ForumMedia = {
  id: number
  type: 'image' | 'video'
  src: string
  name: string
}

type UploadedAvatar = {
  id: number
  src: string
  name: string
  type: string
}

type ForumComment = {
  id: string
  name: string
  initial: string
  authorKey?: string
  message: string
  createdAt: string
  avatarClass: string
  avatarUrl?: string
}

type ForumPost = {
  id: string
  name: string
  initial: string
  authorKey?: string
  title: string
  section: string
  message: string
  media?: ForumMedia[]
  category?: string
  comments: number
  commentItems: ForumComment[]
  likes: number
  likedBy: string[]
  createdAt: string
  avatarClass: string
  avatarUrl?: string
  image?: string
}

const { t } = useI18n()
const { user, userInitial, isAuthenticated, profileAvatar, saveProfileAvatar } = useAuth()
const localePath = useLocalePath()
const route = useRoute()

const forumMenuItems = [
  { key: 'forum', label: 'ფორუმი', subtitle: 'Foro' },
  { key: 'ask-iberia', label: 'კითხე იბერიას', subtitle: 'Pregunta a Iberia' },
  { key: 'document-check', label: 'დოკუმენტების გადამოწმება', subtitle: 'Verificación de documentos' },
]

const activeForumMenu = computed(() => {
  return typeof route.query.section === 'string' ? route.query.section : 'forum'
})

function forumMenuLink(item: typeof forumMenuItems[number]) {
  return localePath({
    path: '/forum',
    query: item.key === 'forum' ? undefined : { section: item.key },
  })
}

const categories = [
  { name: 'მოგზაურობა', className: 'bg-violet-100 text-violet-700' },
  { name: 'ტექნოლოგიები', className: 'bg-emerald-100 text-emerald-700' },
  { name: 'ხელოვნება', className: 'bg-sky-100 text-sky-700' },
  { name: 'განათლება', className: 'bg-orange-100 text-orange-700' },
  { name: 'კულტურა', className: 'bg-pink-100 text-pink-700' },
]

const search = ref('')
const sortBy = ref('newest')
const showComposer = ref(false)
const openCommentsPostId = ref<string | null>(null)
const currentPage = ref(1)
const pages = [1, 2, 3]
const refreshingPosts = ref(false)
const uploadingMedia = ref(false)
const publishingPost = ref(false)
const syncingAvatar = ref(false)
const publishError = ref('')
let refreshTimer: ReturnType<typeof setInterval> | null = null
const commentForms = reactive<Record<string, string>>({})
const seenCommentTimes = ref<Record<string, string>>({})

const form = reactive({
  title: '',
  message: '',
  media: [] as ForumMedia[],
})

const { data: initialPosts } = await useAsyncData<ForumPost[]>(
  'forum-posts',
  () => $fetch('/api/forum/posts'),
  { default: () => [] },
)
const posts = ref<ForumPost[]>((initialPosts.value ?? []).map(normalizePost))

const filteredPosts = computed(() => {
  const term = search.value.toLowerCase()
  const result = posts.value.filter((post) => {
    return post.section === activeForumMenu.value
      && `${post.title} ${post.message} ${post.category}`.toLowerCase().includes(term)
  })

  return [...result].sort((a, b) => {
    if (sortBy.value === 'popular') {
      return b.likes - a.likes
    }
    if (sortBy.value === 'comments') {
      return b.comments - a.comments
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

const visiblePosts = computed(() => filteredPosts.value)
const canModerateForum = computed(() => user.value?.email === 'geo.algabe@gmail.com')

onMounted(async () => {
  localStorage.removeItem('iberia-forum-posts')
  localStorage.removeItem('iberia-forum-posts-migrated')
  loadSeenCommentTimes()
  await ensurePersistedProfileAvatar()
  await refreshPosts()
  initializeSeenCommentTimes()
  refreshTimer = setInterval(() => {
    if (!showComposer.value) {
      refreshPosts()
    }
  }, 5000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})

async function refreshPosts() {
  if (refreshingPosts.value) return

  refreshingPosts.value = true
  try {
    const sharedPosts = await $fetch<ForumPost[]>('/api/forum/posts')
    if (sharedPosts.length || !posts.value.length) {
      posts.value = sharedPosts.map(normalizePost)
    }
    await syncOwnAvatarToPosts()
  }
  finally {
    refreshingPosts.value = false
  }
}

function authHeaders() {
  const token = useCookie<string | null>('auth_token')
  return token.value ? { Authorization: `Bearer ${token.value}` } : {}
}

async function addPost() {
  if (!form.message && !form.media.length) {
    return
  }
  if (publishingPost.value) {
    return
  }

  const author = getCurrentAuthor()
  const payload = {
    name: author.name,
    initial: author.initial,
    authorKey: author.key,
    title: form.title,
    section: activeForumMenu.value,
    message: form.message,
    media: [...form.media],
    comments: 0,
    commentItems: [],
    likes: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
    avatarClass: author.avatarClass,
    avatarUrl: author.avatarUrl,
  }

  publishingPost.value = true
  publishError.value = ''
  try {
    const created = await $fetch<ForumPost>('/api/forum/posts', {
      method: 'POST',
      headers: authHeaders(),
      body: payload,
    })
    posts.value.unshift(normalizePost(created))
    await refreshPosts()

    form.title = ''
    form.message = ''
    form.media = []
    showComposer.value = false
  }
  catch (error) {
    publishError.value = error instanceof Error ? error.message : 'No se pudo publicar'
  }
  finally {
    publishingPost.value = false
  }
}

async function handleMediaUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
    .filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'))

  if (!files.length) {
    return
  }

  uploadingMedia.value = true
  try {
    const mediaItems = await Promise.all(files.map((file, index) => uploadForumFile(file, Date.now() + index)))
    form.media.push(...mediaItems)
  }
  finally {
    uploadingMedia.value = false
    input.value = ''
  }
}

async function persistMediaItems(media: ForumMedia[] = []): Promise<ForumMedia[]> {
  const persisted: ForumMedia[] = []

  for (const item of media) {
    if (!item.src.startsWith('data:')) {
      persisted.push(item)
      continue
    }

    const blob = await (await fetch(item.src)).blob()
    const extension = blob.type.split('/')[1] || (item.type === 'video' ? 'mp4' : 'png')
    const file = new File([blob], item.name || `forum-upload.${extension}`, {
      type: blob.type || (item.type === 'video' ? 'video/mp4' : 'image/png'),
    })

    persisted.push(await uploadForumFile(file, item.id))
  }

  return persisted
}

async function uploadForumFile(file: File, fallbackId: number): Promise<ForumMedia> {
  const data = new FormData()
  data.append('file', file)

  const uploaded = await $fetch<ForumMedia>('/api/forum/media', {
    method: 'POST',
    headers: authHeaders(),
    body: data,
  })

  return {
    id: uploaded.id ?? fallbackId,
    type: uploaded.type,
    src: uploaded.src,
    name: uploaded.name || file.name,
  }
}

async function uploadProfileAvatar(file: File): Promise<UploadedAvatar> {
  const data = new FormData()
  data.append('file', file)

  return await $fetch<UploadedAvatar>('/api/auth/avatar', {
    method: 'POST',
    headers: authHeaders(),
    body: data,
  })
}

async function ensurePersistedProfileAvatar() {
  if (!profileAvatar.value?.startsWith('data:') || !isAuthenticated.value) {
    return
  }

  try {
    const blob = await (await fetch(profileAvatar.value)).blob()
    if (!blob.type.startsWith('image/')) {
      return
    }

    const extension = blob.type.split('/')[1] || 'png'
    const file = new File([blob], `profile-avatar.${extension}`, {
      type: blob.type,
    })
    const uploaded = await uploadProfileAvatar(file)
    await saveProfileAvatar(uploaded.src, uploaded.id)
  }
  catch {
    // Keep the local avatar visible if upload migration fails.
  }
}

async function syncOwnAvatarToPosts() {
  const avatarUrl = profileAvatar.value
  if (!avatarUrl || avatarUrl.startsWith('data:') || !isAuthenticated.value || syncingAvatar.value) {
    return
  }

  const ownKey = currentLikeKey()
  const ownPosts = posts.value.filter(post => post.authorKey === ownKey && post.avatarUrl !== avatarUrl)
  if (!ownPosts.length) {
    return
  }

  syncingAvatar.value = true
  try {
    for (const post of ownPosts) {
      post.avatarUrl = avatarUrl
      await savePost(post)
    }
  }
  catch {
    // A failed avatar sync should not block reading or publishing forum posts.
  }
  finally {
    syncingAvatar.value = false
  }
}

function removeMedia(mediaId: number) {
  form.media = form.media.filter((media) => media.id !== mediaId)
}

function cancelComposer() {
  form.title = ''
  form.message = ''
  form.media = []
  publishError.value = ''
  showComposer.value = false
}

function normalizePost(post: Partial<ForumPost>): ForumPost {
  const name = post.name || 'სტუმარი'
  const commentItems = (post.commentItems || []).map(normalizeComment)
  const media = post.media || (post.image
    ? [{ id: Date.now(), type: 'image' as const, src: post.image, name: post.title || 'image' }]
    : [])

  return {
    id: String(post.id ?? Date.now()),
    name,
    initial: post.initial || name[0].toUpperCase(),
    authorKey: post.authorKey,
    title: post.title || '',
    section: post.section || 'forum',
    message: post.message || '',
    media,
    category: post.category,
    commentItems,
    comments: commentItems.length || post.comments || 0,
    likes: post.likes ?? post.views ?? 0,
    likedBy: post.likedBy || [],
    createdAt: post.createdAt || new Date().toISOString(),
    avatarClass: post.avatarClass || 'bg-violet-600',
    avatarUrl: post.avatarUrl,
    image: post.image,
  }
}

function normalizeComment(comment: Partial<ForumComment>): ForumComment {
  const name = comment.name || 'სტუმარი'

  return {
    id: String(comment.id ?? Date.now()),
    name,
    initial: comment.initial || name[0].toUpperCase(),
    authorKey: comment.authorKey,
    message: comment.message || '',
    createdAt: comment.createdAt || new Date().toISOString(),
    avatarClass: comment.avatarClass || 'bg-zinc-500',
    avatarUrl: comment.avatarUrl,
  }
}

function getCurrentAuthor() {
  const avatarUrl = profileAvatar.value && !profileAvatar.value.startsWith('data:')
    ? profileAvatar.value
    : undefined

  if (isAuthenticated.value && user.value?.username) {
    return {
      name: user.value.username,
      initial: userInitial.value,
      key: currentLikeKey(),
      avatarClass: 'bg-iberia',
      avatarUrl,
    }
  }

  const name = 'სტუმარი'

  return {
    name,
    initial: name[0].toUpperCase(),
    key: 'guest',
    avatarClass: 'bg-violet-600',
    avatarUrl: undefined,
  }
}

function currentLikeKey() {
  if (isAuthenticated.value && user.value) {
    return `user:${user.value.id ?? user.value.email ?? user.value.username}`
  }

  return 'guest'
}

function hasLikedPost(post: ForumPost) {
  return post.likedBy.includes(currentLikeKey())
}

async function savePost(post: ForumPost) {
  const { id, ...payload } = post
  await $fetch<ForumPost>(`/api/forum/posts/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: payload,
  })
}

async function likePost(post: ForumPost) {
  if (hasLikedPost(post)) {
    return
  }

  post.likedBy.push(currentLikeKey())
  post.likes += 1
  await savePost(post)
}

function toggleComments(postId: string) {
  const nextPostId = openCommentsPostId.value === postId ? null : postId
  openCommentsPostId.value = nextPostId
  if (nextPostId) {
    markPostCommentsSeen(nextPostId)
  }
}

function unreadCommentCount(post: ForumPost) {
  const seenAt = seenCommentTimes.value[post.id]
  if (!seenAt) {
    return 0
  }

  const seenTime = new Date(seenAt).getTime()
  return post.commentItems.filter((comment) => {
    return new Date(comment.createdAt).getTime() > seenTime && !ownsComment(comment)
  }).length
}

function latestCommentDate(post: ForumPost) {
  return post.commentItems.reduce<string | null>((latest, comment) => {
    if (!latest || new Date(comment.createdAt).getTime() > new Date(latest).getTime()) {
      return comment.createdAt
    }
    return latest
  }, null)
}

function seenCommentStorageKey() {
  return `iberia-forum-seen-comments:${currentLikeKey()}`
}

function loadSeenCommentTimes() {
  try {
    seenCommentTimes.value = JSON.parse(localStorage.getItem(seenCommentStorageKey()) || '{}')
  }
  catch {
    seenCommentTimes.value = {}
  }
}

function saveSeenCommentTimes() {
  localStorage.setItem(seenCommentStorageKey(), JSON.stringify(seenCommentTimes.value))
}

function initializeSeenCommentTimes() {
  if (Object.keys(seenCommentTimes.value).length) {
    return
  }

  const nextSeen: Record<string, string> = {}
  for (const post of posts.value) {
    nextSeen[post.id] = latestCommentDate(post) || new Date().toISOString()
  }

  seenCommentTimes.value = nextSeen
  saveSeenCommentTimes()
}

function markPostCommentsSeen(postId: string) {
  const post = posts.value.find(item => item.id === postId)
  if (!post) {
    return
  }

  seenCommentTimes.value = {
    ...seenCommentTimes.value,
    [post.id]: latestCommentDate(post) || new Date().toISOString(),
  }
  saveSeenCommentTimes()
}

function canDeletePost(post: ForumPost) {
  return canModerateForum.value || post.authorKey === currentLikeKey() || ownsLegacyForumItem(post.name)
}

function canDeleteComment(comment: ForumComment) {
  return canModerateForum.value || comment.authorKey === currentLikeKey() || ownsLegacyForumItem(comment.name)
}

function ownsComment(comment: ForumComment) {
  return comment.authorKey === currentLikeKey() || ownsLegacyForumItem(comment.name)
}

function ownsLegacyForumItem(name?: string) {
  if (!isAuthenticated.value || !user.value || !name) {
    return false
  }

  const normalizedName = name.trim().toLowerCase()
  const emailName = user.value.email?.split('@')[0]?.trim().toLowerCase()
  const username = user.value.username?.trim().toLowerCase()

  return normalizedName === username || normalizedName === emailName
}

async function deletePost(postId: string) {
  const post = posts.value.find(item => item.id === postId)
  if (!post || !canDeletePost(post)) {
    return
  }

  await $fetch(`/api/forum/posts/${postId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  posts.value = posts.value.filter((post) => post.id !== postId)
  if (openCommentsPostId.value === postId) {
    openCommentsPostId.value = null
  }
  delete commentForms[postId]
}

async function deleteComment(post: ForumPost, commentId: string) {
  const comment = post.commentItems.find(item => item.id === commentId)
  if (!comment || !canDeleteComment(comment)) {
    return
  }

  post.commentItems = post.commentItems.filter(comment => comment.id !== commentId)
  post.comments = post.commentItems.length
  await savePost(post)
}

async function addComment(post: ForumPost) {
  const message = commentForms[post.id]?.trim()

  if (!message) {
    return
  }

  const author = getCurrentAuthor()

  post.commentItems.push({
    id: String(Date.now()),
    name: author.name,
    initial: author.initial,
    authorKey: author.key,
    message,
    createdAt: new Date().toISOString(),
    avatarClass: author.avatarClass,
    avatarUrl: author.avatarUrl,
  })
  post.comments = post.commentItems.length
  commentForms[post.id] = ''
  await savePost(post)
  markPostCommentsSeen(post.id)
}

function categoryClass(category: string) {
  return categories.find((item) => item.name === category)?.className ?? 'bg-zinc-100 text-zinc-700'
}

function relativeDate(value: string) {
  const diffMs = Date.now() - new Date(value).getTime()
  const diffHours = Math.max(1, Math.round(diffMs / 1000 / 60 / 60))

  if (diffHours < 24) {
    return t('forum.relativeHours', { count: diffHours })
  }

  const diffDays = Math.round(diffHours / 24)

  if (diffDays < 30) {
    return t('forum.relativeDays', { count: diffDays })
  }

  const diffMonths = Math.round(diffDays / 30)
  return t('forum.relativeMonths', { count: diffMonths })
}

useSeoMeta({
  title: () => `${t('forum.title')} - Iberia`,
  description: () => t('forum.seoDescription'),
})
</script>
