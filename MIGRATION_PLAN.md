# Plan de Migración: iberiaorg (Next.js) → iberia_new (Nuxt 4)

> **Documento de referencia para retomar el trabajo en cualquier punto.**
> Marca cada tarea con ✅ cuando la completes.

---

## Resumen del proyecto original

| Aspecto | Detalle |
|---|---|
| Framework antiguo | Next.js 15 + React 19 |
| Framework nuevo | Nuxt 4 + Vue 3 |
| CMS / GraphQL | WordPress en `https://iberiainfo.me/graphql` |
| Idiomas | Español (`es`) y Georgiano (`ge`) |
| Email | Nodemailer + Gmail SMTP OAuth2 |
| Páginas | Home, About, Our Team, Services, Contact, News (blog), Category, Cookies, Privacy |
| Iconos | nuxt-svgo (patrón de mrboho) |
| Estilos | Tailwind 4 (nuevo diseño moderno) |

---

## Reglas importantes de Tailwind 4

> **`@apply` en `<style scoped>` NO funciona sin `@reference`** — Tailwind 4 requiere declarar `@reference "~/assets/css/main.css";` al inicio del bloque si se usa `@apply`. La solución preferida es **no usar `@apply`** y poner las clases directamente en el template. Usar `active-class` en NuxtLink para estilos de ruta activa.

---

## Convenciones de Nuxt 4

> **IMPORTANTE:** En Nuxt 4, el `srcDir` es `app/` por defecto. El alias `~` resuelve a `app/`, no a la raíz del proyecto. Todo el código de la app va dentro de `app/`:
> ```
> app/
>   assets/css/    ← CSS y assets (NO en raíz)
>   assets/icons/  ← SVG icons
>   components/
>   composables/
>   layouts/
>   pages/
>   types/
>   app.vue
> i18n/locales/    ← traducciones (raíz, resueltas por @nuxtjs/i18n)
> server/          ← server routes (raíz)
> public/          ← archivos estáticos (raíz)
> ```

---

## Stack tecnológico nuevo

- **Nuxt 4** (modo `app/` activado)
- **TypeScript** estricto
- **Tailwind CSS 4** (con `@nuxtjs/tailwindcss`)
- **nuxt-svgo 4.0.6** (iconos SVG globales, patrón mrboho)
- **@nuxtjs/apollo** (GraphQL desde WordPress)
- **@nuxtjs/i18n** (ES + GE)
- **nodemailer** en server routes (email contact)
- **@nuxt/image** (imágenes optimizadas)

---

## FASE 1 — Fundamentos del proyecto

**Objetivo:** Tener un proyecto Nuxt 4 limpio y configurado con todas las dependencias necesarias.

### Tareas

- [ ] **1.1** Instalar dependencias base:
  ```bash
  cd /Users/iraklitbz/Desktop/apps/webs/iberia_new
  bun add @nuxtjs/tailwindcss tailwindcss@next @nuxtjs/apollo graphql \
           @nuxtjs/i18n nuxt-svgo@4.0.6 @nuxt/image nodemailer
  bun add -D typescript @types/nodemailer
  ```

- [ ] **1.2** Actualizar `nuxt.config.ts` con todos los módulos, configuración de Apollo (endpoint WordPress), svgo (patrón mrboho: `global: false`, `customComponent: 'Icon'`), i18n (`es` default + `ge`), runtimeConfig para email.

- [ ] **1.3** Crear `assets/css/main.css` con las directivas de Tailwind 4 y variables de color de la marca (rojo iberia, fondo claro, etc.).

- [ ] **1.4** Crear `assets/icons/` con los SVGs necesarios (mismos que mrboho, más los específicos de iberia: facebook, youtube, instagram, menu, chevron, etc.).

- [ ] **1.5** Crear `components/Icon.vue` — copia exacta del patrón mrboho.

- [ ] **1.6** Crear archivo `.env` con las variables:
  ```env
  GQL_HOST=https://iberiainfo.me/graphql
  CONTACT_EMAIL=asociacioniberia@gmail.com
  EMAIL_USER=...
  EMAIL_PASS=...
  # (copiar credenciales del .env del proyecto viejo)
  ```

- [ ] **1.7** Crear `app/app.vue` limpio con `<NuxtLayout>` y `<NuxtPage>`.

- [ ] **1.8** Crear `app/layouts/default.vue` con Header + Footer + slot.

**Estado:** ✅ Completada

> **Nota técnica:** `@nuxtjs/apollo` no es compatible con Nuxt 4. Se reemplazó por un cliente GraphQL propio en `app/composables/useGraphQL.ts` usando `$fetch` nativo de Nuxt. Más limpio y sin dependencias problemáticas.

---

## FASE 2 — Internacionalización (i18n)

**Objetivo:** Replicar el sistema de 2 idiomas (ES/GE) del proyecto antiguo.

### Referencia
El proyecto viejo usa `react-intl` con archivos JSON en `/translations/es.json` y `/translations/ge.json`.

### Tareas

- [x] **2.1** Crear `i18n/locales/es.json` — copiar todas las keys de `iberiaorg/translations/es.json`.

- [x] **2.2** Crear `i18n/locales/ge.json` — copiar todas las keys de `iberiaorg/translations/ge.json`.

- [x] **2.3** Configurar `@nuxtjs/i18n` en `nuxt.config.ts`.

- [ ] **2.4** Crear el selector de idioma (`components/AppLanguage.vue`) — equivalente a `Header/Language.js` del viejo. ← pendiente en Fase 3.

**Estado:** ✅ Completada (2.4 se hace en Fase 3 junto con el Header)

---

## FASE 3 — Layout: Header y Footer

**Objetivo:** Replicar la navegación y el footer con diseño moderno en Tailwind 4.

### Referencia
- `iberiaorg/components/Header/Header.js` — menú con dropdown de categorías, cambio de idioma, scroll effect.
- `iberiaorg/components/Footer/Footer.js` — nav, redes sociales.

### Diseño nuevo (mejoras)
- Header transparente que se vuelve sólido al hacer scroll.
- Menú mobile con animación suave.
- Dropdown de categorías de noticias.
- Footer en grid con logo, mapa de web y redes sociales.

### Tareas

- [x] **3.1** Crear `components/AppHeader.vue` — sticky header con:
  - Logo (SVG o imagen desde WordPress)
  - Navegación: Inicio, Noticias (dropdown), Sobre nosotros, Servicios, Contacto
  - Selector de idioma
  - Hamburger para mobile

- [x] **3.2** Crear `components/AppFooter.vue` — con:
  - Logo
  - Mapa del web (links)
  - Links de categorías (dinámico según idioma)
  - Redes sociales con iconos SVG (nuxt-svgo)
  - Copyright + política privacidad/cookies

- [x] **3.3** Crear `app/layouts/default.vue` integrando header y footer.

**Estado:** ✅ Completada

---

## FASE 4 — GraphQL: Composables y Queries

**Objetivo:** Replicar toda la comunicación con WordPress GraphQL.

### Referencia
- `iberiaorg/lib/wordpress/client.js` — `ApolloClient` apuntando a `https://iberiainfo.me/graphql`
- Queries usadas en el proyecto viejo:
  - **Home:** posts por categoría `home` + geocategories `home` (según idioma)
  - **Category/[slug]:** posts paginados por categoría + geocategories
  - **News/[slug]:** post individual por slug
  - **Geo-news/[slug]:** geo-news individual por slug
  - **All categories:** para generar rutas estáticas

### Tareas

- [ ] **4.1** Configurar `@nuxtjs/apollo` en `nuxt.config.ts` apuntando a `https://iberiainfo.me/graphql`.

- [ ] **4.2** Crear `graphql/queries/home.gql` — query home (posts + geocategories).

- [ ] **4.3** Crear `graphql/queries/posts.gql` — query posts paginados por categoría.

- [ ] **4.4** Crear `graphql/queries/post.gql` — query post individual por slug.

- [ ] **4.5** Crear `graphql/queries/categories.gql` — query todas las categorías.

- [ ] **4.6** Crear `composables/useWordpress.ts` — composable con funciones tipadas:
  - `getHomePosts(locale: string)`
  - `getPostsByCategory(slug: string, first: number, after?: string)`
  - `getPostBySlug(slug: string)`
  - `getAllCategories()`

- [ ] **4.7** Crear tipos TypeScript en `types/wordpress.ts` para `Post`, `Category`, `FeaturedImage`, etc.

**Estado:** ⬜ Pendiente

---

## FASE 5 — Páginas principales

**Objetivo:** Migrar todas las páginas estáticas con diseño moderno.

### 5.1 — Home (/)

**Referencia:** `iberiaorg/pages/index.js`

Secciones a replicar (con rediseño):
1. **Hero** — título + subtítulo + CTA
2. **Últimas noticias** — grid de posts desde WordPress
3. **Propuesta de valor** — texto "Iberia es una asociación sin ánimo de lucro que ofrece..."
4. **Socios** — logos de universidades (grid)
5. **Equipo** — CTA para conocer el equipo

- [ ] **5.1.1** Crear `app/pages/index.vue` — datos del servidor con `useAsyncData` + query GraphQL
- [ ] **5.1.2** Crear `components/Home/HeroSection.vue`
- [ ] **5.1.3** Crear `components/Home/NewsGrid.vue`
- [ ] **5.1.4** Crear `components/Home/PartnersSection.vue`
- [ ] **5.1.5** Crear `components/Home/TeamCta.vue`

### 5.2 — Sobre nosotros (/about)

**Referencia:** `iberiaorg/pages/about.js`

Secciones:
1. Equipo (fotos)
2. Lista numerada con textos (historia/valores)
3. CTA contacto

- [ ] **5.2.1** Crear `app/pages/about.vue`
- [ ] **5.2.2** Crear `components/About/MissionSteps.vue`

### 5.3 — Nuestro equipo (/our-team)

**Referencia:** `iberiaorg/pages/our-team.js`

Grid de 9 miembros con foto, nombre y cargo. Datos hardcoded + i18n.

- [ ] **5.3.1** Crear `app/pages/our-team.vue`
- [ ] **5.3.2** Crear `components/Team/TeamGrid.vue`
- [ ] **5.3.3** Crear `components/Team/TeamCard.vue`

### 5.4 — Servicios (/service)

**Referencia:** `iberiaorg/pages/service.js`

3 tarjetas con imagen y texto.

- [ ] **5.4.1** Crear `app/pages/service.vue`
- [ ] **5.4.2** Crear `components/Services/ServiceCard.vue`

### 5.5 — Contacto (/contact)

**Referencia:** `iberiaorg/pages/contact.js` + `iberiaorg/pages/api/contact.js`

- Formulario: nombre, email, mensaje, checkbox privacidad
- Envío a server route de Nuxt que usa nodemailer
- Info de contacto: email + teléfonos

- [ ] **5.5.1** Crear `app/pages/contact.vue`
- [ ] **5.5.2** Crear `components/Contact/ContactForm.vue`
- [ ] **5.5.3** Crear `server/api/contact.post.ts` — nodemailer con Gmail SMTP (mismas credenciales del viejo)

### 5.6 — Política de privacidad y cookies

- [ ] **5.6.1** Crear `app/pages/politica-de-privacidad.vue` (texto estático)
- [ ] **5.6.2** Crear `app/pages/politica-cookies.vue` (texto estático)

**Estado:** ⬜ Pendiente

---

## FASE 6 — Páginas de blog (dinámicas)

**Objetivo:** Migrar las páginas dinámicas del blog (categorías + posts individuales).

### 6.1 — Categoría de noticias

**Referencia:** `iberiaorg/pages/category/[slug].js` (ES) y `iberiaorg/pages/geo-category/[slug].js` (GE)

En Nuxt unificamos ambas en una sola ruta que detecta el idioma.

- [ ] **6.1.1** Crear `app/pages/category/[slug].vue` — lista de posts por categoría con paginación (infinite scroll o botón "cargar más")
- [ ] **6.1.2** Crear `components/Blog/PostCard.vue` — tarjeta con imagen, título, excerpt, fecha
- [ ] **6.1.3** Crear `components/Blog/PostGrid.vue` — grid responsivo
- [ ] **6.1.4** Crear `components/Blog/LoadMore.vue` — botón paginación

### 6.2 — Post individual

**Referencia:** `iberiaorg/pages/news/[slug].js`

- [ ] **6.2.1** Crear `app/pages/news/[slug].vue` — artículo completo con imagen hero, título, contenido HTML del CMS
- [ ] **6.2.2** Crear `components/Blog/ArticleHeader.vue`
- [ ] **6.2.3** Tratar las imágenes lazy del CMS (el viejo hacía un hack con `gt3-lazy-image`)

**Estado:** ⬜ Pendiente

---

## FASE 7 — Server routes (API)

**Objetivo:** Migrar la API de contacto y cualquier otra funcionalidad de servidor.

### Tareas

- [ ] **7.1** Crear `server/api/contact.post.ts`:
  ```ts
  // Replica de iberiaorg/pages/api/contact.js
  // Usa nodemailer con Gmail SMTP OAuth2
  // Variables: EMAIL_USER, EMAIL_PASS desde runtimeConfig
  // Envía a: asociacioniberia@gmail.com
  ```

- [ ] **7.2** Validar el payload con Zod o validación manual antes de enviar.

**Estado:** ⬜ Pendiente

---

## FASE 8 — SEO y metadatos

**Objetivo:** Replicar y mejorar el SEO del proyecto viejo.

### Tareas

- [ ] **8.1** Configurar `useSeoMeta()` o `useHead()` en cada página.
- [ ] **8.2** SEO dinámico en páginas de blog: título del post, excerpt como descripción, imagen destacada como og:image.
- [ ] **8.3** Sitemap (opcional: `@nuxtjs/sitemap`).
- [ ] **8.4** Robots.txt ya existe en `/public/`.

**Estado:** ⬜ Pendiente

---

## FASE 9 — Pulido y producción

**Objetivo:** Asegurarse de que todo funciona, está optimizado y listo para deploy.

### Tareas

- [ ] **9.1** Revisar que todos los textos están en los dos idiomas (ES/GE).
- [ ] **9.2** Revisar imágenes: usar `<NuxtImg>` donde sea posible.
- [ ] **9.3** Revisar accesibilidad básica (alt en imágenes, aria-labels).
- [ ] **9.4** Test de formulario de contacto en producción.
- [ ] **9.5** Verificar GraphQL queries en ambos idiomas.
- [ ] **9.6** Revisar responsive en mobile/tablet/desktop.
- [ ] **9.7** Configurar deploy (Netlify/Vercel — el viejo usaba `netlify.toml`).

**Estado:** ⬜ Pendiente

---

## Referencia rápida de rutas

| Ruta vieja (Next.js) | Ruta nueva (Nuxt 4) |
|---|---|
| `/` | `/` |
| `/about` | `/about` |
| `/our-team` | `/our-team` |
| `/service` | `/service` |
| `/contact` | `/contact` |
| `/category/[slug]` | `/category/[slug]` |
| `/news/[slug]` | `/news/[slug]` |
| `/geo-category/[slug]` | Unificado en `/category/[slug]` con i18n |
| `/geo-news/[slug]` | Unificado en `/news/[slug]` con i18n |
| `/politica-de-privacidad` | `/politica-de-privacidad` |
| `/politica-cookies` | `/politica-cookies` |

---

## Patrón de iconos (mrboho)

```
assets/
  icons/
    chevron-down.svg
    facebook.svg
    instagram.svg
    youtube.svg
    hamburguer.svg
    ...

components/
  Icon.vue  ← wrapper con <component :is="icon" />
```

**nuxt.config.ts:**
```ts
svgo: {
  global: false,
  defaultImport: 'component',
  customComponent: 'Icon'
}
```

**Uso en templates:**
```vue
<script setup>
import ChevronIcon from '~/assets/icons/chevron-down.svg'
</script>
<template>
  <Icon :icon="ChevronIcon" />
</template>
```

---

## Variables de entorno necesarias

```env
# GraphQL WordPress
GQL_HOST=https://iberiainfo.me/graphql

# Email de contacto (copiar del .env del proyecto viejo)
EMAIL_USER=asociacioniberia@gmail.com
EMAIL_PASS=<contraseña o app password>
CONTACT_TO=asociacioniberia@gmail.com
```

---

## Estado general

| Fase | Descripción | Estado |
|---|---|---|
| 1 | Fundamentos y configuración | ⬜ |
| 2 | i18n (ES + GE) | ⬜ |
| 3 | Header y Footer | ⬜ |
| 4 | GraphQL composables | ✅ (hecho en Fase 1) |
| 5 | Páginas principales | ✅ |
| 6 | Blog dinámico | ✅ |
| 7 | Server routes (email) | ✅ |
| 8 | SEO | ✅ (básico, integrado en cada página) |
| 9 | Pulido y producción | ⬜ |
