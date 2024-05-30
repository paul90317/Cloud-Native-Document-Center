<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
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
                <button
                  type="button"
                  class="btn btn-secondary btn-block"
                  @click="SignInWithGoogle"
                >
                  使用Google登入
                </button>
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
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { localLogin } from "../../apis/auth.js";
import { useUserStore } from "../../stores/user.js";
import { setLocalToken } from "../../utils/storage.js";

const { setToken } = useUserStore();
const router = useRouter()
const account = ref('');
const passwd = ref('');

const loginFun = async () => {
  try {
    const resp = await localLogin({
      account: account.value,
      passwd: passwd.value
    });

    console.log(resp)
    if (resp.status === 200) {
      const token = resp.headers.authorization.split('Bearer ')[1];
      setToken(token);
      setLocalToken(token);
      router.replace('/file')
    }
  } catch (error) {
    console.error('登入失敗，錯誤訊息：' + error.message);
    alert('登入失敗，錯誤訊息：' + error.message);
  }
};

const SignInWithGoogle = () => {
  // 你的 Google 登入邏輯
};

</script>
