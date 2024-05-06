<script setup>
import { uploadImage } from '@/apis/document';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ImageUploader from 'quill-image-uploader';
import { ref } from 'vue';

const content = ref('')
const modules = ref({
  name: 'imageUploader',
  module: ImageUploader,
  options: {
    upload: (file) => handleUploadImage(file)
  }
})

// TODO: Implement the function to upload the image
const handleUploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('image', file)

    uploadImage(formData)
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
</script>

<template>
  <QuillEditor
    v-model="content"
    theme="snow"
    toolbar="essential"
    :modules="modules"
  />
</template>
