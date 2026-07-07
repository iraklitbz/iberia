<template>
  <div class="login-scene relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-8">
    <img
      class="scene-art"
      src="/images/login/madrid-watercolor-background.png"
      alt=""
      aria-hidden="true"
    />
    <div class="scene-light" aria-hidden="true" />
    <div class="cyclist-lane" aria-hidden="true">
      <div class="cyclist-track">
        <img class="cyclist-art" src="/images/login/summer-cyclist-v2.png" alt="" />
      </div>
    </div>
    <div class="drifting-leaves" aria-hidden="true">
      <span class="leaf leaf-one" />
      <span class="leaf leaf-two" />
      <span class="leaf leaf-three" />
      <span class="leaf leaf-four" />
      <span class="leaf leaf-five" />
      <span class="leaf leaf-six" />
      <span class="leaf leaf-seven" />
      <span class="leaf leaf-eight" />
    </div>

    <div class="auth-card relative z-10 w-full max-w-sm p-6 sm:p-7">
      <div class="mb-7 text-center">
        <NuxtLink :to="localePath('/')" class="mb-5 inline-flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/dj6draudd/image/upload/v1771671543/logo_iberia_icon_b2924031c3.svg"
            alt="Iberia"
            width="40"
            height="40"
            class="size-9"
          />
        </NuxtLink>
        <h1 class="font-display text-2xl font-bold text-[#173c25]">{{ $t('auth.loginTitle') }}</h1>
        <p class="mt-2 text-sm text-[#426648]">{{ $t('auth.loginSubtitle') }}</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div v-if="error" class="rounded border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {{ error }}
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-[#24462d]">{{ $t('auth.email') }}</label>
          <input
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="login-input"
            :placeholder="$t('auth.emailPlaceholder')"
          />
        </div>

        <div>
          <div class="mb-1.5 flex items-center justify-between gap-4">
            <label class="text-sm font-medium text-[#24462d]">{{ $t('auth.password') }}</label>
            <NuxtLink
              :to="localePath('/forgot-password')"
              class="text-xs text-[#2f6f3f] hover:underline"
            >
              {{ $t('auth.forgotPasswordLink') }}
            </NuxtLink>
          </div>
          <input
            v-model="form.password"
            type="password"
            required
            autocomplete="current-password"
            class="login-input"
            :placeholder="$t('auth.passwordPlaceholder')"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="flex w-full items-center justify-center gap-2 rounded bg-[#2f6f3f] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245a33] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg v-if="loading" class="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ $t('auth.login') }}
        </button>
      </form>

      <div class="relative my-5">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-[#c9dfbd]" />
        </div>
        <div class="relative flex justify-center">
          <span class="rounded bg-white/30 px-3 text-xs text-[#55735b]">{{ $t('auth.orContinueWith') }}</span>
        </div>
      </div>

      <button
        type="button"
        class="flex w-full items-center justify-center gap-3 rounded border border-[#c9dfbd] bg-white px-4 py-2.5 text-sm font-medium text-[#24462d] transition-colors hover:bg-[#f2faed]"
        @click="connectWithProvider('google')"
      >
        <svg class="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {{ $t('auth.continueWithGoogle') }}
      </button>

      <p class="mt-6 text-center text-sm text-[#426648]">
        {{ $t('auth.noAccount') }}
        <NuxtLink :to="localePath('/register')" class="font-medium text-[#2f6f3f] hover:underline">
          {{ $t('auth.createAccount') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', headerSolid: true })

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const { login, token, connectWithProvider } = useAuth()

if (token.value) {
  await navigateTo(localePath('/account'))
}

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await login(form.email, form.password)
    await router.push(localePath('/account'))
  }
  catch (err: unknown) {
    const e = err as { data?: { error?: { message?: string } } }
    error.value = e?.data?.error?.message ?? t('auth.errorGeneric')
  }
  finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-scene {
  background: #f2dfbd;
}

.scene-art {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.scene-light {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 54% 36%, rgb(255 248 222 / 0.34), transparent 38%),
    linear-gradient(90deg, rgb(255 255 255 / 0.46), transparent 32%, transparent 68%, rgb(255 255 255 / 0.22)),
    linear-gradient(180deg, rgb(255 255 255 / 0.12), rgb(232 202 154 / 0.16));
  animation: light-breathe 7s ease-in-out infinite;
}

.auth-card {
  box-sizing: border-box;
  border: 1px solid rgb(255 255 255 / 0.58);
  border-right-color: rgb(255 255 255 / 0.34);
  border-bottom-color: rgb(255 255 255 / 0.34);
  border-radius: 16px;
  background: rgb(255 255 255 / 0.62);
  box-shadow: 0 24px 54px rgb(102 65 27 / 0.18);
  backdrop-filter: blur(18px);
}

.login-input {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #c9dfbd;
  border-radius: 4px;
  background: #fff;
  padding: 0.625rem 0.75rem;
  color: #173c25;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.login-input::placeholder {
  color: #789374;
}

.login-input:focus {
  border-color: #2f6f3f;
  box-shadow: 0 0 0 3px rgb(47 111 63 / 0.13);
}

.drifting-leaves {
  position: absolute;
  inset: 0;
  z-index: 20;
  overflow: hidden;
  pointer-events: none;
}

.cyclist-lane {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.cyclist-track {
  position: absolute;
  bottom: clamp(-2.5rem, -3vh, -0.5rem);
  left: 0;
  width: clamp(22rem, 42vw, 36rem);
  animation: cyclist-route 15s linear infinite;
  will-change: transform;
}

.cyclist-art {
  display: block;
  width: 100%;
  height: auto;
  animation: cyclist-bob 1.35s ease-in-out infinite;
  will-change: transform;
}

.leaf {
  position: absolute;
  top: -7%;
  width: clamp(0.55rem, 1vw, 0.85rem);
  height: clamp(0.85rem, 1.5vw, 1.2rem);
  border-radius: 90% 0 90% 0;
  background: #fff7b2;
  filter: drop-shadow(0 2px 1px rgb(44 83 34 / 0.18));
  animation: leaf-fall linear infinite;
}

.leaf-one { left: 9%; animation-duration: 11s; animation-delay: -3s; }
.leaf-two { left: 23%; background: #ffffff; animation-duration: 13s; animation-delay: -9s; }
.leaf-three { left: 39%; background: #fff0a1; animation-duration: 12s; animation-delay: -6s; }
.leaf-four { left: 52%; background: #f6d66a; animation-duration: 10s; animation-delay: -2s; }
.leaf-five { left: 65%; background: #ffffff; animation-duration: 14s; animation-delay: -11s; }
.leaf-six { left: 75%; background: #fff7b2; animation-duration: 12.5s; animation-delay: -5s; }
.leaf-seven { left: 87%; background: #f6d66a; animation-duration: 10.5s; animation-delay: -8s; }
.leaf-eight { left: 95%; background: #ffffff; animation-duration: 13.5s; animation-delay: -4s; }

@keyframes leaf-fall {
  0% {
    transform: translate3d(0, -5vh, 0) rotate(0deg);
    opacity: 0;
  }
  12% {
    opacity: 0.95;
  }
  44% {
    transform: translate3d(2.4rem, 44vh, 0) rotate(180deg);
  }
  100% {
    transform: translate3d(-1.6rem, 110vh, 0) rotate(410deg);
    opacity: 0;
  }
}

@keyframes cyclist-route {
  0% {
    transform: translateX(calc(-100% - 3vw)) scaleX(1);
  }
  100% {
    transform: translateX(calc(100vw + 3vw)) scaleX(1);
  }
}

@keyframes cyclist-bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-0.12rem);
  }
}

@keyframes light-breathe {
  50% {
    opacity: 0.76;
  }
}

@media (max-width: 639px) {
  .login-scene {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }

  .scene-art {
    object-position: center center;
  }

  .scene-light {
    background:
      linear-gradient(90deg, rgb(255 255 255 / 0.5), transparent 82%),
      linear-gradient(0deg, rgb(232 202 154 / 0.18), transparent 76%);
  }

  .cyclist-track {
    bottom: -0.75rem;
    width: clamp(18rem, 78vw, 25rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .scene-light,
  .leaf,
  .cyclist-track,
  .cyclist-art {
    animation: none;
  }

  .leaf {
    display: none;
  }

  .cyclist-track {
    left: 3vw;
    transform: none;
  }
}
</style>
