// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || 'http://localhost:8000',
      mapId: process.env.GOOGLE_MAP_ID || ''
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'id'
      },
      titleTemplate: '%s — Pezen',
      title: 'Pezen',
      meta: [
        { charset: 'utf-8' },
        { name: 'keywords', content: 'kasir digital, pesan makanan, reservasi restoran' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'googlebot', content: 'notranslate' },
        { name: 'msapplication-TileColor', content: '#ffa84c' },
        { name: 'theme-color', content: '#ffffff' },
        { hid: 'description', name: 'description', content: 'Pezen | Aplikasi untuk memesan makanan (food), katering (catering), reservasi (booking) dan jasa boga lainnya secara online.' },
        { rel: 'preconnect', href: process.env.API_URL, crossorigin: true }
      ],
      script: [
        { src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API}&map_ids=${process.env.GOOGLE_MAP_ID}`, defer: true }
      ]
    },
  },
  css: [
    '~/assets/fonts.scss',
  ],
  build: {
    loaders: {
      scss: {
        implementation: require('sass')
      }
    },
  },
})
