<template>
  <hr>
  <div id="selectstudent" class="container">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <table
          id="table_add"
          class="display"
          style="width:100%"
        >
          <thead>
            <tr>
              <th>
                <input
                  id="addselect_all"
                  type="checkbox"
                  name="select_all"
                  value="1"
                  @click="leftselectall"
                >
              </th>
              <th>name</th>
              <th>priority</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users.data" :key="user.id">
              <td>
                <input
                  v-model="user.checked"
                  type="checkbox"
                  :value="user.id"
                  @click="handleCheckboxClick(user)"
                >
              </td>
              <td>{{ user.name }}</td>
              <td>
                <select v-model="user.priority">
                  <option value="0">
                    viewer
                  </option>
                  <option value="1">
                    editor
                  </option>
                  <option value="2">
                    reviewer
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <hr>
        <div class="row justify-content-center">
          <div class="col-sm-12 col-md-4">
            <button
              type="button"
              class="btn btn-success"
              @click="addtable"
            >
              新增
            </button>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-sm-12 col-md-4">
            <div class="d-flex justify-content-between align-items-center">
              <button
                class="btn btn-outline-primary"
                :disabled="leftcurrentPage === 1"
                @click="leftprevPage"
              >
                back
              </button>
              <span>頁數：{{ leftcurrentPage }}</span>
              <button
                class="btn btn-outline-primary"
                :disabled="leftcurrentPage === lefttotalPages"
                @click="leftnextPage"
              >
                next
              </button>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <label for="leftpageSize">每頁顯示筆數：</label>
            <select v-model="leftpageSize" @change="fetchData">
              <option value="10">
                10
              </option>
              <option value="20">
                20
              </option>
              <option value="50">
                50
              </option>
              <option value="100">
                100
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6">
        <div class="row">
          <div class="col-sm-12">
            <input v-model="searchTerm" type="text" placeholder="搜尋...">
            <button @click="searchright">搜尋</button>
          </div>
        </div>
        <table
          id="table_delete"
          class="display"
          style="width:100%"
        >
          <thead>
            <tr>
              <th>
                <input
                  id="select_all"
                  type="checkbox"
                  name="select_all"
                  value="1"
                  @click="deleteselectall"
                >
              </th>
              <th>name</th>
              <th>priority</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsersRight" :key="user.id">
              <td>
                <input
                  v-model="user.checked"
                  type="checkbox"
                  :value="user.id"
                >
              </td>
              <td>{{ user.name }}</td>
              <td>{{ user.role }}</td>
            </tr>
          </tbody>
        </table>
        <hr>
        <div class="row justify-content-center">
          <div class="col-sm-12 col-md-4">
            <button
              type="button"
              class="btn btn-danger"
              @click="deletetable"
            >
              刪除
            </button>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-sm-12 col-md-4">
            <div class="d-flex justify-content-between align-items-center">
              <button
                class="btn btn-outline-primary"
                :disabled="currentPageRight === 1"
                @click="prevPageRight"
              >
                back
              </button>
              <span>頁數：{{ currentPageRight }}</span>
              <button
                class="btn btn-outline-primary"
                :disabled="currentPageRight === totalPagesRight"
                @click="nextPageRight"
              >
                next
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
          <div class="col-sm-12">
            <label for="pageSizeRight">每頁顯示筆數：</label>
            <select v-model="pageSizeRight" @change="fetchDataRight">
              <option value="10">
                10
              </option>
              <option value="20">
                20
              </option>
              <option value="50">
                50
              </option>
              <option value="100">
                100
              </option>
            </select>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>

import { addfilemember, deletefilemember, getfilemembers } from "../../../apis/file.js";
import { submitFile,deleteFileReviewer } from "../../../apis/review.js";
import {reactive,computed,ref, onMounted}  from 'vue'; 
import {getAllUserInfo} from "../../../apis/auth.js";
import { useRoute } from 'vue-router';

const leftpageSize = ref(10); 
const leftcurrentPage = ref(1); 
const lefttotalPages = ref(0); 
const leftuser = ref([]); 
let searchTerm = ref('')
const document_id = ref(null)

const displayedleftData = computed(() => { 
  const start = (leftcurrentPage.value - 1) * leftpageSize.value;
  const end = start + leftpageSize.value;
  return leftuser.value.slice(start, end);
});

const route = useRoute();
const users = reactive({ data: [] });

onMounted(fetchData); 
async function fetchData() {
  document_id.value = route?.params?.id;
  try {
    const usersData = await getAllUserInfo();
    const usersData2 = await getmembers();
    // 假設每個用戶都有一個唯一的 id
    const usersData2accounts = new Set(usersData2.map(user => user.account));
    leftuser.value = usersData.data.filter(user => !usersData2accounts.has(user.account));
    lefttotalPages.value = Math.ceil(leftuser.value.length / leftpageSize.value); 
    users.data = displayedleftData.value; // assign displayed data to users.data
    console.log('User data fetched successfully:', usersData.data); 
  } catch (error) {
    console.error('Error fetching user data:', error); // print the error message
  }
}
const leftselectall = () => {
  const areAllSelected = users.data.every(user => user.checked);
  users.data.forEach(user => user.checked = !areAllSelected);
};
function leftnextPage() {
  if (leftcurrentPage.value < lefttotalPages.value) {
    leftcurrentPage.value++;
    users.data = displayedleftData.value; // update users.data when page changes
  }
}
function leftprevPage() {
  if (leftcurrentPage.value > 1) {
    leftcurrentPage.value--;
    users.data = displayedleftData.value; // update users.data when page changes
  }
}

const getmembers = async () => {
  try {
    const ID = document_id.value;
    const resp = await getfilemembers(ID);
    console.log(resp)
    if (resp.status === 200) {
      console.log('文件權限讀取成功');
      return resp.data;
    }
  } catch (error) {
    console.error('文件權限讀取失敗，錯誤訊息：' + error.message);
    alert('文件權限讀取失敗，錯誤訊息：' + error.message);
  }
};

const search = () => {
  if (searchTerm.value === '') {
    users.data = displayedleftData.value;
    return;
  }
  users.data = users.data.filter(user => user.name.includes(searchTerm.value))
}

async function addtable() {
  const checkedUsers = users.data.filter(user => user.checked);
  console.log(checkedUsers);
  for (const user of checkedUsers) {
    try {
      await addmember(user.account, user.priority);
    } catch (error) {
      console.error(`Error adding user ${user.account}:`, error);
    }
  }
}

const addmember = async (account,role) => {
  try {
    const ID = document_id.value;
    if(role != 2) {
      const resp = await addfilemember({ID, account, role});
    } else {
      let message = "Please review the document!";
      const userInput = prompt('請輸入給審核者的通知');
      if (userInput !== null) {
        message = userInput;
      }
      const resp = await submitFile(ID, {account, message});
    }
    console.log(resp)
    if (resp.status === 200) {
      console.log('文件權限創建成功!' );
      return ;
    }
  } catch (error) {
    console.error('文件權限創建失敗，錯誤訊息：' + error.message);
    alert('文件權限創建失敗，錯誤訊息：' + error.message);
  }
};

function handleCheckboxClick(user) {
  user.checked = !user.checked;
  console.log(user.checked);
}
</script>