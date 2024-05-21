<template>
  <div class="container">
    <div class="row pt-3 justify-content-center">
      <div class="col-3 my-auto text-center">
        <form id="form" @submit.prevent="submitForm">
          <h1 class="mb-4 text-center" style="white-space: nowrap;">
            登入頁面
          </h1>
          <div class="text-center" style="white-space: nowrap;">
            帳號
          </div>
          <input
            type="text"
            placeholder="請輸入帳號名稱"
            class="mb-3 px-3 pe-4 py-2"
            v-model="account"
          >
          <div class="text-center" style="white-space: nowrap;">
            密碼
          </div>
          <input
            type="password"
            placeholder="請輸入密碼"
            class="mb-4 px-3 pe-4 py-2"
            v-model="passwd"
          >
          <button class="mb-4 text-center btn btn-lg btn-primary w-100" type="submit">
            登入
          </button>
          <RouterLink to="/signup">
            註冊
          </RouterLink>
          <div class="text-end login-buttom">
            <RouterLink to="/register">
              第三方登入
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref}  from 'vue';
import {localLogin} from "../../apis/auth.js";
import {useUserStore} from "../../stores/user.js";
import {useRouter} from "vue-router";
import {setLocalToken} from "../../utils/storage.js";

const { setToken } = useUserStore();
const router = useRouter()
const account = ref('');
const passwd = ref('');

async function submitForm() {
  const resp = await localLogin({
    account: account.value,
    passwd:passwd.value
  });

  console.log(resp)
  if (resp.status === 200) {
    const token = resp.headers.authorization.split('Bearer ')[1];
    setToken(token);
    setLocalToken(token);
    router.replace('/file')
  }
}
</script>
