import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router'

import { QuillEditor } from '@vueup/vue-quill'

createApp(App).use(router).component('QuillEditor', QuillEditor).mount('#app')
