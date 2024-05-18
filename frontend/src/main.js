import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

import router from './router'

import { QuillEditor } from '@vueup/vue-quill'

import { createPinia } from 'pinia'

if (import.meta.env.MODE === 'development') {
  const { worker } = await import('./mocks/browser')
  worker.start({ onUnhandledRequest: 'bypass' })
}

createApp(App).use(router)
  .use(createPinia())
  .component('QuillEditor', QuillEditor).mount('#app')
