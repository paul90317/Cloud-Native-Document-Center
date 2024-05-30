<template>
  <hr>
  <div id="selectstudent" class="container">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div class="row">
          <div class="col-sm-12">
            <label for="pageSize">每頁顯示筆數：</label>
            <select v-model="pageSize" @change="fetchData">
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
                  @click="addselectall"
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
                >
              </td>
              <td>{{ user.name }}</td>
              <td>
                <select v-model="user.priority">
                  <option value="viewer">
                    viewer
                  </option>
                  <option value="editor">
                    editor
                  </option>
                  <option value="reviewer">
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
                :disabled="currentPage === 1"
                @click="prevPage"
              >
                back
              </button>
              <span>頁數：{{ currentPage }}</span>
              <button
                class="btn btn-outline-primary"
                :disabled="currentPage === totalPages"
                @click="nextPage"
              >
                next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-6">
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
          <tbody />
        </table>
        <hr>
        <div class="row" style="text-align:center">
          <div class="col-sm col-md-4" />
          <div class="col-sm col-md-4">
            <button
              type="button"
              class="btn btn-danger"
              @click="deletetable"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import {reactive,computed,ref, onMounted}  from 'vue'; 
import {getAllUserInfo} from "../../../apis/auth.js";
import {useUserStore} from "../../../stores/user.js";
import {useRouter} from "vue-router";
import {setLocalToken} from "../../../utils/storage.js";

const pageSize = ref(10); 
const currentPage = ref(1); 
const totalPages = ref(0); 
const allData = ref([]); 

const displayedData = computed(() => { 
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return allData.value.slice(start, end);
});
const { setToken } = useUserStore();
const router = useRouter();
const users = reactive({ data: [] });
onMounted(fetchData); 
async function fetchData() {
  const token = setToken.value; // get the token
  try {
    const usersData = await getAllUserInfo(token);
    allData.value = usersData.data; // assign the user data to allData
    totalPages.value = Math.ceil(allData.value.length / pageSize.value); 
    users.data = displayedData.value; // assign displayed data to users.data
    console.log('User data fetched successfully:', usersData.data); 
  } catch (error) {
    console.error('Error fetching user data:', error); // print the error message
  }
}
const addselectall = () => {
  const areAllSelected = users.data.every(user => user.checked);
  users.data.forEach(user => user.checked = !areAllSelected);
};
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    users.data = displayedData.value; // update users.data when page changes
  }
}
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    users.data = displayedData.value; // update users.data when page changes
  }
}
</script>