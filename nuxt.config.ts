// https://nuxt.com/docs/api/configuration/nuxt-config
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt', 
    '@sidebase/nuxt-auth'
  ],
  auth: {
    provider: {
      type: 'authjs',
      addDefaultCallbackUrl: true
    },
    globalAppMiddleware: {
      isEnabled: true,
      addDefaultCallbackUrl: true
    }
  },
  vite: {
    plugins: [
      Components({
        resolvers: [
          AntDesignVueResolver({ importStyle: false, resolveIcons: true })
        ]
      })
    ],
    ssr: {
      noExternal: ['moment', 'compute-scroll-into-view', 'ant-design-vue', '@ant-design/icons-vue', 'echarts']
    }
  }
})
