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
          <!-- Save Button -->
          <button
            type="button"
            class="btn btn-outline-success"
            :disabled="!member"
            @click="saveForm"
          >
            <i class="bi bi-save" /> Save
          </button>
          <!-- Retrieve Button -->
          <button
            type="button"
            class="btn btn-outline-info"
            :disabled="!member"
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
import { createEmptyDoc, getFile, getfilemembers, updateFile } from "@/apis/file.js";
import { getInfo } from '@/apis/user';
import Editor from '@/components/Editor.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const UserAccount = ref('');
const document_id = ref(null)
const submitAndClearEditor = ref('')
const member = ref('')

onMounted(async () => {
  // * Can use "file_id.value" to get the value of "file_id
  document_id.value = route?.params?.id;

  if (document_id.value) {
    const data = await getDoc(document_id.value);
    newsForm.title = data.docname;
    newsForm.content = data.content;
    submitAndClearEditor.value = data.content;
  }else {
    newsForm.title = '';
    newsForm.content = '';
    submitAndClearEditor.value = '';
  }
  await fetchUserInfo();
  const members = await getmembers();
  member.value = members.some(m => m.account == UserAccount.value && m.role == 1) ? 1 : 0;
});

const fetchUserInfo = async () => {
  try {
    const response = await getInfo()
    if (response?.status === 200) {
      UserAccount.value = response.data.account
    }
  } catch (error) {
    console.error(error)
  }
};

const createDoc = async (docname, content) => {
  try {
    const resp = await createEmptyDoc({docname, content});

    if (resp.status === 200) {
      alert('文件創建成功');
      document_id.value = resp.data.id;
      return resp.data.id;
    }
  } catch (error) {
    console.error(error)
  }
};

const updateDoc = async (docname, content) => {
  try {
    const resp = await updateFile(document_id.value,{docname, content});

    if (resp.status === 200) {
      alert('文件更新成功');
      return resp.data.id;
    }
  } catch (error) {
    console.error(error)
  }
};

const getDoc = async () => {
  try {
    const resp = await getFile(document_id.value);
    if (resp.status === 200) {
      console.log('文件讀取成功');
      return resp.data;
    }
  } catch (error) {
    console.error(error)
  }
};

const newsForm = reactive({
  title: '',
  content: '',
})

const handleEditorChange = async (content) => {
  newsForm.content = await content
}

const saveForm = async () => {
  if (window.confirm("Are you sure you want to save the form?")) {
    const docname = newsForm.title; 
    const content = newsForm.content;
    if(document_id.value == null) {
      await createDoc(docname, content);
    } else {
      await updateDoc(docname, content);
    }
  }
}

const retrieveForm = async () => {
  if (window.confirm("Are you sure you want to retrieve the form?")) {
    const data = await getDoc(document_id.value);
    newsForm.title = data.docname;
    newsForm.content = data.content;
    submitAndClearEditor.value = data.content;
  }
}

const handleSubmitAndEditorClear = async (value) => {
  submitAndClearEditor.value = await value
}

const getmembers = async () => {
  try {
    const ID = document_id.value;
    const resp = await getfilemembers(ID);
    if (resp.status === 200) {
      console.log('文件權限讀取成功');
      return resp.data;
    }
  } catch (error) {
    console.error(error)
  }
};
</script>