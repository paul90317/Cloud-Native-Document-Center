<template>
  <div class="w-100">
    <div class="d-flex justify-content-between align-items-center mt-0 mb-2">
      <span>Content : </span>
      <div class="me-5 text-secondary">
        TextLength：{{ TextLength }}
      </div>
      <!-- Clear Button Triggering Modal -->
      <button
        v-if="!disabled"
        type="button"
        class="btn btn-outline-danger"
        data-bs-toggle="modal"
        data-bs-target="#clearModal"
      >
        <i class="bi bi-trash" /> Clear
      </button>
    </div>
    <QuillEditor
      ref="myQuillEditor" 
      theme="snow"
      class="mx-auto"
      content-type="html"
      :placeholder="disabled ? '' : 'write something down...'"
      :toolbar="toolbarOptions"
      :modules="modules"
      :enabled="!disabled"
      :read-only="disabled"
      @update:content="onEditorChange($event)"
    />
  </div>
  <!-- Clear Modal -->
  <div
    id="clearModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="clearModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="clearModalLabel" class="modal-title">
            Confirmation
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          Are you sure to clear content?
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            No
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="clearContent"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { Quill, QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import BlotFormatter from "quill-blot-formatter/dist/BlotFormatter";
import ImageUploader from 'quill-image-uploader';
import { onMounted, ref, toRaw, watch } from 'vue';
import { uploadImage } from "../apis/image.js";

const TextLength = ref(0)
const myQuillEditor = ref(null)
const props = defineProps({
  submitAndClearEditor: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['emitOnEditorChange', 'emitOnSubmitAndEditorClear'])

const clearContent = async () => {
  await myQuillEditor.value.setContents('')
}

const onEditorChange = async (e) => {
  TextLength.value = await myQuillEditor.value.getText().length - 1
  emit('emitOnEditorChange', e)
}

watch(() => props.submitAndClearEditor, async (newValue) => {
  if (newValue) {
    await myQuillEditor.value.setContents(newValue)
  }
  emit('emitOnSubmitAndEditorClear', '');
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
// Quill: Modules
const modules = ref([
  {
    name: "blotFormatter",
    module: BlotFormatter,
    options: {
      /* options */
    }
  },
  {
    name: 'imageUploader',
    module: ImageUploader,
    options: {
      upload: async file => {
        try {
          const formData = new FormData()
          formData.append("file", file)
          const resp = await uploadImage(formData);
          if (resp.status === 200) {
            return resp.data.url;
          }
        } catch (err) {
          console.error("Image Upload failed")
          console.error("Error:", err)
        }
      }
    }
  }
]);

Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register("modules/imageUploader", ImageUploader);
</script>
