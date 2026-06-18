<template>
  <div class="min-h-screen bg-zinc-50 pt-16">
    <section class="border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <h1 class="text-2xl font-extrabold tracking-normal text-zinc-950">{{ t('forum.title') }}</h1>

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
              <span v-if="isAuthenticated">{{ userInitial }}</span>
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
          <button type="button" class="rounded-lg border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50" @click="cancelComposer">
            {{ t('forum.cancel') }}
          </button>
          <button type="submit" class="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700">
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
              {{ post.initial }}
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
              class="flex items-center gap-2 rounded-md transition hover:text-violet-700"
              @click="toggleComments(post.id)"
            >
              <svg class="size-5 text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
              </svg>
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
                  {{ comment.initial }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-zinc-900">{{ comment.name }}</p>
                  <p class="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-700">{{ comment.message }}</p>
                  <time class="mt-2 block text-xs text-zinc-400" :datetime="comment.createdAt">
                    {{ relativeDate(comment.createdAt) }}
                  </time>
                </div>
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

type ForumComment = {
  id: number
  name: string
  initial: string
  message: string
  createdAt: string
  avatarClass: string
}

type ForumPost = {
  id: number
  name: string
  initial: string
  title: string
  message: string
  media?: ForumMedia[]
  category?: string
  comments: number
  commentItems: ForumComment[]
  likes: number
  likedBy: string[]
  createdAt: string
  avatarClass: string
  image?: string
}

const STORAGE_KEY = 'iberia-forum-posts'
const { t } = useI18n()
const { user, userInitial, isAuthenticated } = useAuth()

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
const openCommentsPostId = ref<number | null>(null)
const currentPage = ref(1)
const pages = [1, 2, 3]
const posts = ref<ForumPost[]>([])
const commentForms = reactive<Record<number, string>>({})

const form = reactive({
  title: '',
  message: '',
  media: [] as ForumMedia[],
})

const filteredPosts = computed(() => {
  const term = search.value.toLowerCase()
  const result = posts.value.filter((post) => {
    return `${post.title} ${post.message} ${post.category}`.toLowerCase().includes(term)
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

onMounted(() => {
  const savedPosts = localStorage.getItem(STORAGE_KEY)

  if (!savedPosts) {
    return
  }

  try {
    posts.value = JSON.parse(savedPosts).map(normalizePost)
  }
  catch {
    posts.value = []
  }
})

watch(posts, (value) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}, { deep: true })

function addPost() {
  if (!form.message && !form.media.length) {
    return
  }

  const author = getCurrentAuthor()

  posts.value.unshift({
    id: Date.now(),
    name: author.name,
    initial: author.initial,
    title: form.title,
    message: form.message,
    media: [...form.media],
    comments: 0,
    commentItems: [],
    likes: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
    avatarClass: author.avatarClass,
  })

  form.title = ''
  form.message = ''
  form.media = []
  showComposer.value = false
}

async function handleMediaUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
    .filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'))

  if (!files.length) {
    return
  }

  const mediaItems = await Promise.all(files.map(async (file, index) => {
    return {
      id: Date.now() + index,
      type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
      src: await readFileAsDataUrl(file),
      name: file.name,
    }
  }))

  form.media.push(...mediaItems)
  input.value = ''
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function removeMedia(mediaId: number) {
  form.media = form.media.filter((media) => media.id !== mediaId)
}

function cancelComposer() {
  form.title = ''
  form.message = ''
  form.media = []
  showComposer.value = false
}

function normalizePost(post: Partial<ForumPost>): ForumPost {
  const name = post.name || 'სტუმარი'
  const commentItems = (post.commentItems || []).map(normalizeComment)
  const media = post.media || (post.image
    ? [{ id: post.id ?? Date.now(), type: 'image' as const, src: post.image, name: post.title || 'image' }]
    : [])

  return {
    id: post.id ?? Date.now(),
    name,
    initial: post.initial || name[0].toUpperCase(),
    title: post.title || '',
    message: post.message || '',
    media,
    category: post.category,
    commentItems,
    comments: commentItems.length || post.comments || 0,
    likes: post.likes ?? post.views ?? 0,
    likedBy: post.likedBy || [],
    createdAt: post.createdAt || new Date().toISOString(),
    avatarClass: post.avatarClass || 'bg-violet-600',
    image: post.image,
  }
}

function normalizeComment(comment: Partial<ForumComment>): ForumComment {
  const name = comment.name || 'სტუმარი'

  return {
    id: comment.id ?? Date.now(),
    name,
    initial: comment.initial || name[0].toUpperCase(),
    message: comment.message || '',
    createdAt: comment.createdAt || new Date().toISOString(),
    avatarClass: comment.avatarClass || 'bg-zinc-500',
  }
}

function getCurrentAuthor() {
  if (isAuthenticated.value && user.value?.username) {
    return {
      name: user.value.username,
      initial: userInitial.value,
      avatarClass: 'bg-iberia',
    }
  }

  const name = 'სტუმარი'

  return {
    name,
    initial: name[0].toUpperCase(),
    avatarClass: 'bg-violet-600',
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

function likePost(post: ForumPost) {
  if (hasLikedPost(post)) {
    return
  }

  post.likedBy.push(currentLikeKey())
  post.likes += 1
}

function toggleComments(postId: number) {
  openCommentsPostId.value = openCommentsPostId.value === postId ? null : postId
}

function addComment(post: ForumPost) {
  const message = commentForms[post.id]?.trim()

  if (!message) {
    return
  }

  const author = getCurrentAuthor()

  post.commentItems.push({
    id: Date.now(),
    name: author.name,
    initial: author.initial,
    message,
    createdAt: new Date().toISOString(),
    avatarClass: author.avatarClass,
  })
  post.comments = post.commentItems.length
  commentForms[post.id] = ''
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
