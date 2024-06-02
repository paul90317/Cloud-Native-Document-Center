import { createApp } from 'vue'
import GoogleSignInPlugin from "vue3-google-signin"
import App from './App.vue'
import './style.css'

import router from './router'

import { QuillEditor } from '@vueup/vue-quill'

import { createPinia } from 'pinia'

if (import.meta.env.MODE === 'development') {
  const { worker } = await import('./mocks/browser')
  worker.start({ onUnhandledRequest: 'bypass' })
}

console.log("GOOGLE_CLIENT     =====================>  ", import.meta.env.VITE_GOOGLE_CLIENT_ID)

createApp(App)
  .use(router)
  .use(createPinia())
  .use(GoogleSignInPlugin, {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
  })
  .component('QuillEditor', QuillEditor).mount('#app')
