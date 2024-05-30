<template>
  <div class="card mx-auto mt-4">
    <div class="card-body">
      <form @submit.prevent="submitForm">
        <!-- Title -->
        <div class="form-group mb-3">
          <label for="title">Title : </label>
          <input
            id="title"
            v-model="newsForm.title"
            type="text"
            class="form-control"
          >
        </div>
        <!-- Content -->
        <div class="form-group mb-3">
          <Editor
            :submit-and-clear-editor="submitAndClearEditor"
            @emit-on-editor-change="handleEditorChange"
            @emit-on-submit-and-editor-clear="handleSubmitAndEditorClear"
          />
        </div>
        <div class="form-group d-flex justify-content-between">
          <!-- Submit Button -->
          <button
            type="button"
            class="btn btn-outline-primary"
            @click="submitForm"
          >
            <i class="bi bi-check-circle" /> Submit
          </button>
          <!-- Save Button -->
          <button
            type="button"
            class="btn btn-outline-success"
            @click="saveForm"
          >
            <i class="bi bi-save" /> Save
          </button>
          <!-- Retrieve Button -->
          <button
            type="button"
            class="btn btn-outline-info"
            @click="retrieveForm"
          >
            <i class="bi bi-upload" /> Retrieve
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import Editor from '@/components/Editor.vue';
import { reactive, ref } from 'vue';

const submitAndClearEditor = ref(false)

const newsForm = reactive({
  title: '',
  content: '',
})

const handleEditorChange = async (content) => {
  newsForm.content = await content
}

const submitForm = async () => {
  if (window.confirm("Are you sure you want to submit the form?")) {
    // Submit form logic here
  }
}

const saveForm = async () => {
  if (window.confirm("Are you sure you want to save the form?")) {
    // Save form logic here
  }
}

const retrieveForm = async () => {
  if (window.confirm("Are you sure you want to retrieve the form?")) {
    // Retrieve form logic here
  }
}

const handleSubmitAndEditorClear = async (value) => {
  submitAndClearEditor.value = await value
}
</script>