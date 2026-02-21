# Plan de implementación: Auth con Clerk

Stack: Nuxt 3 + Clerk + WordPress (solo CMS, sin tocar)

---

## Fase 1 — Setup externo (15 min)

### 1.1 Cuenta y app en Clerk
- Crear cuenta en https://clerk.com
- Crear nueva aplicación → nombrarla "Iberia"
- En el dashboard, activar providers:
  - Email/Password ✅
  - Google ✅ (necesita crear OAuth app en Google Cloud Console)
  - Facebook ✅ (necesita crear app en Meta Developers)

### 1.2 Google OAuth
- Ir a https://console.cloud.google.com
- Crear proyecto → APIs & Services → Credentials → OAuth 2.0 Client ID
- Authorized redirect URI: `https://accounts.clerk.dev/v1/oauth_callback`
- Copiar Client ID y Client Secret → pegarlos en Clerk dashboard

### 1.3 Facebook OAuth
- Ir a https://developers.facebook.com
- Crear app → Facebook Login → Web
- OAuth Redirect URI: `https://accounts.clerk.dev/v1/oauth_callback`
- Copiar App ID y App Secret → pegarlos en Clerk dashboard

### 1.4 Variables de entorno
Clerk da dos claves: Publishable Key y Secret Key.
Crear/actualizar `.env`:
```
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NUXT_CLERK_SECRET_KEY=sk_test_...
```

---

## Fase 2 — Instalación en Nuxt (20 min)

### 2.1 Instalar paquete
```bash
bun add @clerk/nuxt
```

### 2.2 Registrar módulo en nuxt.config.ts
```ts
export default defineNuxtConfig({
  modules: ['@clerk/nuxt'],
  clerk: {
    // opciones opcionales, por defecto lee las env vars
  }
})
```

### 2.3 Comprobar que funciona
```bash
bun dev
```
Con solo esto ya hay sesión disponible en toda la app via `useAuth()` y `useUser()`.

---

## Fase 3 — Roles (10 min, todo en Clerk dashboard)

### 3.1 Crear roles en Clerk
- Dashboard → Configure → Roles & Permissions
- Crear rol `user` (rol por defecto al registrarse)
- Crear rol `premium` (se asigna manualmente o via webhook cuando paguen)

### 3.2 Metadata del usuario
Clerk permite guardar `publicMetadata` en cada usuario:
```json
{ "role": "user" }
// o
{ "role": "premium" }
```
Esto se leerá en el frontend para mostrar/ocultar contenido.

---

## Fase 4 — Páginas de auth (45 min)

### 4.1 Páginas a crear
- `app/pages/sign-in.vue` — formulario de login
- `app/pages/sign-up.vue` — formulario de registro
- `app/pages/account.vue` — perfil del usuario (protegida)

### 4.2 Clerk tiene componentes listos (opción rápida)
```vue
<!-- pages/sign-in.vue -->
<template>
  <SignIn />
</template>
```
```vue
<!-- pages/sign-up.vue -->
<template>
  <SignUp />
</template>
```
Los componentes de Clerk incluyen email, Google y Facebook de serie.
Se pueden personalizar con CSS variables para que encajen con el diseño.

### 4.3 Composables disponibles en cualquier componente
```ts
const { isSignedIn, userId } = useAuth()
const { user } = useUser()
const role = computed(() => user.value?.publicMetadata?.role)
const isPremium = computed(() => role.value === 'premium')
```

---

## Fase 5 — Protección de rutas (20 min)

### 5.1 Middleware global
Crear `app/middleware/auth.global.ts`:
```ts
// Rutas que requieren login
const protectedRoutes = ['/account', '/premium']

export default defineNuxtRouteMiddleware((to) => {
  const { isSignedIn } = useAuth()
  if (protectedRoutes.includes(to.path) && !isSignedIn.value) {
    return navigateTo('/sign-in')
  }
})
```

### 5.2 Middleware para rutas premium
Crear `app/middleware/premium.ts`:
```ts
export default defineNuxtRouteMiddleware(() => {
  const { user } = useUser()
  const isPremium = user.value?.publicMetadata?.role === 'premium'
  if (!isPremium) {
    return navigateTo('/account') // o página de upgrade
  }
})
```
Usarlo en una página: `definePageMeta({ middleware: 'premium' })`

---

## Fase 6 — Integración con el navbar (20 min)

Actualizar `AppHeader.vue` para mostrar:
- Si NO hay sesión: botón "Login" / "Registrarse"
- Si HAY sesión: avatar del usuario + menú desplegable (Mi cuenta, Cerrar sesión)
- Si es `premium`: badge o indicador visual

```ts
// en AppHeader.vue
const { isSignedIn } = useAuth()
const { user } = useUser()
```

---

## Fase 7 — Servidor / API routes (opcional, si se necesita)

Si en algún momento necesitas verificar el token en el servidor (por ejemplo para proteger endpoints de Nuxt server routes):

```ts
// server/api/protected.get.ts
import { clerkClient, getAuth } from '@clerk/nuxt/server'

export default defineEventHandler(async (event) => {
  const { userId } = getAuth(event)
  if (!userId) throw createError({ statusCode: 401 })
  // ...
})
```

---

## Orden de ejecución recomendado para mañana

1. [ ] Fase 1 — Crear cuentas y configurar OAuth (hacer esto primero, puede tardar por aprobaciones de Meta)
2. [ ] Fase 2 — Instalar y configurar en Nuxt
3. [ ] Fase 3 — Crear roles en dashboard
4. [ ] Fase 4 — Páginas sign-in y sign-up
5. [ ] Fase 5 — Middleware de protección
6. [ ] Fase 6 — Actualizar navbar
7. [ ] Fase 7 — Solo si se necesita lógica server-side

---

## Notas importantes

- **Facebook puede tardar** en aprobar la app si el dominio no está verificado. Empezar por ahí.
- Los componentes `<SignIn />` y `<SignUp />` de Clerk tienen modo "modal" también, no solo página completa.
- Para cambiar a un usuario a `premium`, por ahora se hace manualmente desde el dashboard de Clerk → Users → editar metadata. Cuando haya sistema de pagos, se automatiza via webhook.
- WordPress no se toca en ninguna de estas fases. Sigue funcionando como CMS exactamente igual.
