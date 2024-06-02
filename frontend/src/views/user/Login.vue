<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-10 col-lg-8 mx-auto">
        <div class="card">
          <div class="card-body">
            <h1 class="text-center">
              Document Center
            </h1>
            <form @submit.prevent="loginFun">
              <div class="form-group">
                <label for="account">帳號</label>
                <input
                  id="account"
                  v-model="account"
                  type="text"
                  class="form-control"
                  required
                >
              </div>
              <div class="form-group mb-3">
                <label for="passWord">密碼</label>
                <input
                  id="passWord"
                  v-model="passwd"
                  type="password"
                  class="form-control"
                  required
                >
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary btn-block mb-3">
                  登入
                </button>
              </div>
              <div class="form-group">
                <GoogleSignInButton
                  @success="handleLoginSuccess"
                  @error="handleLoginError"
                />
              </div>
              <div class="text-center mt-3">
                <RouterLink to="/SignUp" class="btn btn-link">
                  註冊
                </RouterLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { GoogleSignInButton } from "vue3-google-signin";
import { localLogin } from "../../apis/auth.js";
import { useUserStore } from "../../stores/user.js";
import { setLocalToken } from "../../utils/storage.js";

const { setToken, logout } = useUserStore();
const router = useRouter();
const route = useRoute();

const account = ref('');
const passwd = ref('');

onMounted(() => {
  const message = route.params?.message;
  if (message) alert(message);
});

const loginFun = async () => {
  if (!account.value || !passwd.value) {
    alert('請輸入帳號密碼');
    return;
  }

  try {
    const resp = await localLogin({
      account: account.value,
      passwd: passwd.value
    });
    if (resp.status !== 200) throw new Error(resp?.data?.message);
    
    const token = resp.headers?.authorization?.split('Bearer ')?.[1];
    if (!token) throw new Error('無法取得 token');
    
    console.log('登入成功');

    setToken(token);
    setLocalToken(token);

    router.push({ name: 'file.index'});
  } catch (error) {
    console.error('登入失敗，錯誤訊息：' + error.message);
    alert('登入失敗，錯誤訊息：' + error.message);
  }
};

// handle success event
const handleLoginSuccess = (response) => {
  const { credential } = response;
  console.log("Access Token", response);
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};

</script>
