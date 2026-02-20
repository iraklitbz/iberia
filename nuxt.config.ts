import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/i18n',
    'nuxt-svgo',
    '@nuxt/image',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/main.css'],

  // Patrón de iconos igual que mrboho
  svgo: {
    global: false,
    defaultImport: 'component',
    customComponent: 'Icon',
  },

  // i18n: Español (default) + Georgiano
  i18n: {
    locales: [
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'ge', name: 'ქართული', file: 'ge.json' },
    ],
    defaultLocale: 'es',
    langDir: 'locales/',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    // Permite HTML en strings de traducción (necesario para claves _html)
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
  },

  // Variables de entorno: privadas (sólo servidor) y públicas (cliente)
  runtimeConfig: {
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    contactTo: process.env.CONTACT_TO,
    public: {
      gqlHost: process.env.GQL_HOST,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'https://iberiainfo.me',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#c8102e' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' as const },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Noto+Sans+Georgian:wght@300;400;500;600;700&family=Noto+Serif+Georgian:wght@400;500;600;700;800;900&display=swap',
        },
      ],
    },
    layoutTransition: { name: 'fade', mode: 'out-in' },
    pageTransition: { name: 'fade', mode: 'out-in' },
  },
})
