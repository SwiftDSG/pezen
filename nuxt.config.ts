// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000'
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
        { hid: 'description', name: 'description', content: 'Pezen | Aplikasi untuk memesan makanan (food), katering (catering), reservasi (booking) dan jasa boga lainnya secara online.' }
      ],
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
