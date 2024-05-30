<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h2 class="text-center mb-4">
              Account Create
            </h2>
            <form @submit.prevent="localregister">
              <div class="form-group mb-3">
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
              <div class="form-group mb-3">
                <label for="email">電子郵件</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  required
                >
              </div>
              <div class="form-group mb-3">
                <label for="name">暱稱</label>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  class="form-control"
                  required
                >
              </div>
              <div class="form-group mb-3">
                <label for="phone">手機號碼</label>
                <input
                  id="phone"
                  v-model="phone"
                  type="tel"
                  class="form-control"
                  required
                >
              </div>
              <div class="form-group mb-3">
                <label for="profile">個性簽名</label>
                <textarea
                  id="profile"
                  v-model="profile"
                  class="form-control"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <button type="submit" class="btn btn-primary btn-block">
                  Register Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {logalRegister} from "../../apis/auth.js";
import {useRouter} from "vue-router";

const router = useRouter();
const account = ref('');
const passwd = ref('');
const email = ref('');
const name = ref('');
const phone = ref('');
const profile = ref('');

const localregister = async () => {
  try {
    const resp = await logalRegister({
      account: account.value,
      passwd: passwd.value,
      email: email.value,
      name: name.value,
      phone: phone.value,
      profile: profile.value
    });

    if (resp.status === 200) {
      router.replace('/file')
    }
  } catch (error) {
    console.error('註冊失敗，錯誤訊息：' + error.message);
    alert('註冊失敗，錯誤訊息：' + error.message);
  }
}
</script>