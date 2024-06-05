<template>
  <hr>
  <div id="selectstudent" class="container">
    <div class="row row-cols-1 row-cols-md-2 g-3 g-md-4 mb-md-0">
      <div class="col my-4">
        <div class="row">
          <div class="col-12">
            <div class="input-group mb-3">
              <input
                v-model="add_search_form"
                type="text"
                placeholder="搜尋..."
                class="form-control"
              >
              <button
                class="btn btn-outline-primary"
                type="button"
                @click="add_search_button"
              >
                搜尋
              </button>
              <button
                type="button"
                class="btn btn-success text-center"
                @click="add_button_click"
              >
                新增
              </button>
            </div>
          </div>
    
          <div class="col-12">
            <table
              v-if="addusers?.data?.length > 0"
              id="table_add"
              class="display table table-striped"
              style="width:100%"
            >
              <thead>
                <tr>
                  <th scope="col">
                    <input
                      id="addselect_all"
                      class="form-check-input"
                      type="checkbox"
                      name="select_all"
                      value="1"
                      v-model="areAlladdUsersSelected"
                      @click="add_selectall"
                    >
                  </th>
                  <th scope="col">
                    name
                  </th>
                  <th scope="col">
                    priority
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in addusers.data" :key="user.id">
                  <td>
                    <input
                      v-model="user.checked"
                      class="form-check-input"
                      type="checkbox"
                      :value="user.id"
                      @click="handleCheckboxClick(user)"
                    >
                  </td>
                  <td>{{ user.name }}</td>
                  <td>
                    <select v-model="user.priority" class="form-select">
                      <option value="0" :disabled="!user_role">
                        viewer
                      </option>
                      <option value="1" :disabled="!user_role">
                        editor
                      </option>
                      <option value="2" >
                        reviewer
                      </option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center">
              <p>尚無資料</p>
            </div>
          </div>
    
          <div class="col-12">
            <nav class="w-full">
              <ul class="pagination justify-content-center">
                <li
                  :class="{'page-item':true, 'disabled':add_currentPage === 1}"
                >
                  <button
                    class="btn btn-outline-primary"
                    :disabled="add_currentPage === 1"
                    @click="add_prevpage"
                  >
                    back
                  </button>
                </li>
                <li class="page-item d-flex align-items-center">
                  <span class="mx-2">頁數：{{ add_currentPage ?? 0 }}</span>
                </li>
                <li
                  :class="{'page-item':true, 'disabled':add_currentPage === add_totalPages}"
                >
                  <button
                    class="btn btn-outline-primary"
                    :disabled="add_currentPage === add_totalPages"
                    @click="add_nextpage"
                  >
                    next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
    
          <div class="col-12 row">
            <div class="col d-flex align-items-center justify-content-end">
              <label for="add_pageSize" class="form-label mb-0">每頁顯示筆數：</label>
            </div>
            <div class="col">
              <select
                v-model="add_pageSize"
                class="form-select"
                @change="fetchData"
              >
                <option value="1">
                  1
                </option>
                <option value="2">
                  2
                </option>
                <option value="10">
                  10
                </option>
                <option value="20">
                  20
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <hr class="d-block d-md-none mx-auto w-75">

      <div class="col my-4">
        <div class="row">
          <div class="col-12">
            <div class="input-group mb-3">
              <input
                v-model="delete_search_form"
                type="text"
                placeholder="搜尋..."
                class="form-control"
              >
              <button
                class="btn btn-outline-primary"
                type="button"
                @click="delete_search_button"
              >
                搜尋
              </button>
              <button
                type="button"
                class="btn btn-danger text-center"
                @click="delete_button_click"
              >
                刪除
              </button>
            </div>
          </div>

          <div class="col-12">
            <table
              v-if="deleteusers?.data?.length > 0"
              id="table_delete"
              class="display table table-striped"
              style="width:100%"
            >
              <thead>
                <tr>
                  <th scope="col">
                    <input
                      id="select_all"
                      class="form-check-input"
                      type="checkbox"
                      name="select_all"
                      value="1"
                      v-model="areAlldeleteUsersSelected"
                      @click="delete_selectall"
                    >
                  </th>
                  <th scope="col">
                    account
                  </th>
                  <th scope="col">
                    priority
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in deleteusers.data" :key="user.id">
                  <td>
                    <input
                      v-model="user.checked"
                      class="form-check-input"
                      type="checkbox"
                      :value="user.id"
                      @click="handleCheckboxClick(user)"
                    >
                  </td>
                  <td>{{ user.account }}</td>
                  <td>
                    <span v-if="user.role === 0">viewer</span>
                    <span v-else-if="user.role === 1">editor</span>
                    <span v-else>reviewer</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center">
              <p>尚無資料</p>
            </div>
          </div>

          <div class="col-12">
            <nav class="w-full">
              <ul class="pagination justify-content-center">
                <li
                  :class="{'page-item':true, 'disabled':delete_currentPage === 1}"
                >
                  <button
                    class="btn btn-outline-primary"
                    :disabled="delete_currentPage === 1"
                    @click="delete_prevpage"
                  >
                    back
                  </button>
                </li>
                <li class="page-item d-flex align-items-center">
                  <span class="mx-2">頁數：{{ delete_currentPage ?? 0 }}</span>
                </li>
                <li
                  :class="{'page-item':true, 'disabled':delete_currentPage === delete_totalPages}"
                >
                  <button
                    class="btn btn-outline-primary"
                    :disabled="delete_currentPage === delete_totalPages"
                    @click="delete_nextpage"
                  >
                    next
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div class="col-12 row">
            <div class="col d-flex align-items-center justify-content-end">
              <label for="delete_pageSize" class="form-label mb-0">每頁顯示筆數：</label>
            </div>
            <div class="col">
              <select
                v-model="delete_pageSize"
                class="form-select"
                @change="fetchData"
              >
                <option value="1">
                  1
                </option>
                <option value="2">
                  2
                </option>
                <option value="10">
                  10
                </option>
                <option value="20">
                  20
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { addfilemember, deletefilemember, getfilemembers } from "@/apis/file.js";
import { deleteFileReviewer, submitFile } from "@/apis/review.js";
import { getInfo } from '@/apis/user';
import { getAllUserInfo } from "@/apis/user.js";
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const add_pageSize = ref(1); 
const add_currentPage = ref(1); 
const add_totalPages = ref(0); 
const delete_pageSize = ref(1); 
const delete_currentPage = ref(1); 
const delete_totalPages = ref(0); 
const add_table_user = ref([]); 
const delete_table_user = ref([]);
let add_search_form = ref('');
let delete_search_form = ref('');
const document_id = ref(null);
const route = useRoute();
const addusers = reactive({ data: [] });
const deleteusers = reactive({ data: [] });

const display_add_page = computed(() => { 
  const start = (add_currentPage.value - 1) * add_pageSize.value;
  const end = start + add_pageSize.value;
  return add_table_user.value.slice(start, end);
});

const display_delete_page = computed(() => { 
  const start = (delete_currentPage.value - 1) * delete_pageSize.value;
  const end = start + delete_pageSize.value;
  return delete_table_user.value.slice(start, end);
});

const areAlldeleteUsersSelected = computed(() => deleteusers.data.every(user => user.checked));
const areAlladdUsersSelected = computed(() => addusers.data.every(user => user.checked));
const UserAccount = ref('');
const user_role = ref('');
onMounted(fetchData); 

async function fetchData() {
  let members = [];
  document_id.value = route?.params?.id;
  try {
    const alluser = await getAllUserInfo();
    await fetchUserInfo();
    members = await getmembers();
    user_role.value = members.some(m => m.account == UserAccount.value && m.role == 1) ? 1 : 0;
    const membersaccount = new Set(members.map(user => user.account));
    add_table_user.value = alluser.data.filter(user => !membersaccount.has(user.account));
    add_totalPages.value = Math.ceil(add_table_user.value.length / add_pageSize.value); 
    add_currentPage.value = 1;
    addusers.data = display_add_page.value; 
  } catch (error) {
    console.error('Error fetching user data:', error); 
  }
  try {
    delete_table_user.value = members;
    delete_totalPages.value = Math.ceil(delete_table_user.value.length / delete_pageSize.value); 
    delete_currentPage.value = 1;
    deleteusers.data = display_delete_page.value;
  } catch (error) {
    console.error('Error fetching members data:', error); 
  }
}
const add_selectall = () => {
  const areAllSelected = addusers.data.every(user => user.checked);
  addusers.data.forEach(user => user.checked = !areAllSelected);
};

const delete_selectall = () => {
  const areAllSelected = deleteusers.data.every(user => user.checked);
  deleteusers.data.forEach(user => user.checked = !areAllSelected);
};

function add_nextpage() {
  if (add_currentPage.value < add_totalPages.value) {
    add_currentPage.value++;
    addusers.data = display_add_page.value; 
  }
}
function add_prevpage() {
  if (add_currentPage.value > 1) {
    add_currentPage.value--;
    addusers.data = display_add_page.value; 
  }
}

function delete_nextpage() {
  if (delete_currentPage.value < delete_totalPages.value) {
    delete_currentPage.value++;
    deleteusers.data = display_delete_page.value; 
  }
}
function delete_prevpage() {
  if (delete_currentPage.value > 1) {
    delete_currentPage.value--;
    deleteusers.data = display_delete_page.value; 
  }
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
    console.error('文件權限讀取失敗');
    alert('文件權限讀取失敗');
  }
};

const add_search_button = () => {
  addusers.data = add_table_user.value.filter(user => user.name.includes(add_search_form.value))
}

const delete_search_button = () => {
  deleteusers.data = delete_table_user.value.filter(user => user.name.includes(delete_search_form.value))
}

async function add_button_click() {
  const checkedUsers = addusers.data.filter(user => user.checked);
  for (const user of checkedUsers) {
    try {
      await add_member(user.account, user.priority);
    } catch (error) {
      console.error(`Error adding user ${user.account}:`, error);
    }
  }
}

async function delete_button_click() {
  const checkedUsers = deleteusers.data.filter(user => user.checked);
  for (const user of checkedUsers) {
    try {
      await delete_member(user.account, user.role);
    } catch (error) {
      console.error(`Error deleting user ${user.account}:`, error);
    }
  }
}

const add_member = async (account,role) => {
  try {
    const ID = document_id.value;
    let resp
    if(role != 2) {
      resp = await addfilemember({
        'doc-id': ID,
        account, 
        role
      });
    } else {
      let message = "Please review the document!";
      const userInput = prompt('請輸入給審核者的通知');
      if (userInput !== null) {
        message = userInput;
      }
      resp = await submitFile(ID, {
        "reviewer": account,
        message
      });
    }
    if (resp.status === 200) {
      console.log('文件權限創建成功!' );
      fetchData();
      location.reload();
      return ;
    }
  } catch (error) {
    console.error('文件權限創建失敗，錯誤訊息：' + error.message);
    alert('文件權限創建失敗');
  }
};

const delete_member = async (account,role) => {
  try {
    const ID = document_id.value;
    let resp
    if(role != 2) {
      resp = await deletefilemember({
        'doc-id': ID,
        account
      });
    } else {
      resp = await deleteFileReviewer(ID);
    }
    if (resp.status === 200) {
      console.log('文件成員刪除成功!' );
      fetchData();
      location.reload();
      return ;
    }
  } catch (error) {
    console.error('文件成員刪除失敗，錯誤訊息：' + error.message);
    alert('文件成員刪除失敗');
  }
};

function handleCheckboxClick(user) {
  user.checked = !user.checked;
  console.log(user.checked);
}
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
</script>