import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

import router from './router'

import { QuillEditor } from '@vueup/vue-quill'

createApp(App).use(router).component('QuillEditor', QuillEditor).mount('#app')
