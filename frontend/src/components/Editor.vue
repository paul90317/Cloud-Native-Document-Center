<template>
  <div class="w-100">
    <div class="d-flex justify-content-between align-items-center mt-0 mb-2">
      <span>Content : </span>
      <div class="me-5 text-secondary">
        TextLength：{{ TextLength }}
      </div>
      <!--清空按鈕-->
      <el-popconfirm
        title="Are you sure to clear content？"
        cancel-button-text="no"
        confirm-button-text="yes"
        @confirm="clearContent"
      >
        <template #reference>
          <el-button
            size="medium"
            type="danger"
            style="border-radius: 50px; background-color: #1890ff; color: #fff; height: 40px; line-height: 40px; padding: 0 20px;"
          >
            clear
          </el-button>
        </template>
      </el-popconfirm>
    </div>
    
    <QuillEditor
      ref="myQuillEditor" 
      theme="snow"
      class="mx-auto"
      content-type="html"
      placeholder="write something down..."
      :toolbar="toolbarOptions"
      :modules="[uploadModule, BlotFormatterModule]"
      @update:content="onEditorChange($event)"
    />
  </div>
</template>



<script setup>
import { QuillEditor } from '@vueup/vue-quill';
import { ElPopconfirm } from 'element-plus';
import BlotFormatter from 'quill-blot-formatter';
import ImageUploader from 'quill-image-uploader';
import { onMounted, ref, toRaw, watch } from 'vue';
// import { uploadImage } from '@/apis/image';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const TextLength = ref(0)
const myQuillEditor = ref(null)
const props = defineProps({
  submitAndClearEditor: Boolean,
  content: String,
})
const emit = defineEmits(['emitOnEditorChange', 'emitOnSubmitAndEditorClear'])

// ↓ 清空按鈕的回調，使用 setContents 方法清空編輯器的內容
const clearContent = async () => {
  await myQuillEditor.value.setContents('')
}

const onEditorChange = async (e) => {
  TextLength.value = await myQuillEditor.value.getText().length - 1
  emit('emitOnEditorChange', e)
}

watch(() => props.submitAndClearEditor, async (newValue) => {
  emit('emitOnSubmitAndEditorClear', false)
  await toRaw(myQuillEditor).value.setContents('')
})

onMounted(async () => {
  props.content && await toRaw(myQuillEditor).value.setContents(props.content)
})
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
    ['link', 'image'],
]

const uploadModule = ref({
  name: 'imageUploader',
  module: ImageUploader,
  options: {
    upload: file => {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append("file", file)
        adminApi.news.postContentImg(formData)
          .then(res => {
            resolve(res.data.imgUrl)
          })
          .catch(err => {
            reject("Upload failed")
            console.error("Error:", err)
          })
      })
    }
  }
})
const BlotFormatterModule = ref({
  name: 'blotFormatter',
  module: BlotFormatter,
  options: {/* options */}
})
</script>
