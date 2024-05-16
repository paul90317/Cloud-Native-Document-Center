import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

import router from './router'

import { QuillEditor } from '@vueup/vue-quill'

if (import.meta.env.MODE === 'development') {
  const { worker } = await import('./mocks/browser')
  worker.start()
}

createApp(App).use(router).component('QuillEditor', QuillEditor).mount('#app')
