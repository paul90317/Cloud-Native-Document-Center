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
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { createEmptyDoc, getFile, updateFile } from "../apis/file.js";
import { getAllUserInfo } from "../apis/user.js"; // 導入 getAllUserInfo 函數
import { getLocalToken } from "../utils/storage.js";

const route = useRoute();

const file_id = ref(null);
const UserAccount = ref('');
const document_id = ref(null)
const submitAndClearEditor = ref('')

onMounted(async () => {
  // * Can use "file_id.value" to get the value of "file_id
  file_id.value = route?.params?.id;

  const UserInfo = await fetchAllUserInfo();
  if (UserInfo && UserInfo.length > 0) {
    UserAccount.value = UserInfo[0].account;
    console.log(UserAccount.value);
  }
});

const fetchAllUserInfo = async () => {
  try {
    const token = getLocalToken(); // 獲取本地存儲的 JWT 憑證
    const resp = await getAllUserInfo(token); // 將 JWT 憑證傳遞給 getAllUserInfo 函數
    console.log(token);
    console.log(resp);
    if (resp.status === 200) {
      console.log('獲取所有用戶信息成功');
      return resp.data;
    }
  } catch (error) {
    console.error('獲取所有用戶信息失敗，錯誤訊息：' + error.message);
    alert('獲取所有用戶信息失敗，錯誤訊息：' + error.message);
  }
};

const createDoc = async (docname, content) => {
  try {
    const resp = await createEmptyDoc({docname, content});

    console.log(resp)
    if (resp.status === 200) {
      console.log('文件創建成功，文件 ID：' + resp.data.id);
      document_id.value = resp.data.id;
      return resp.data.id;
    }
  } catch (error) {
    console.error('文件創建失敗，錯誤訊息：' + error.message);
    alert('文件創建失敗，錯誤訊息：' + error.message);
  }
};

const updateDoc = async (docname, content) => {
  try {
    const resp = await updateFile(document_id.value,{docname, content});

    console.log(resp)
    if (resp.status === 200) {
      console.log('文件更新成功');
      return resp.data.id;
    }
  } catch (error) {
    console.error('文件更新失敗，錯誤訊息：' + error.message);
    alert('文件更新失敗，錯誤訊息：' + error.message);
  }
};

const getDoc = async () => {
  try {
    const resp = await getFile(document_id.value);
    console.log(resp)
    if (resp.status === 200) {
      console.log('文件讀取成功');
      return resp.data;
    }
  } catch (error) {
    console.error('文件讀取失敗，錯誤訊息：' + error.message);
    alert('文件讀取失敗，錯誤訊息：' + error.message);
  }
};

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
</script>