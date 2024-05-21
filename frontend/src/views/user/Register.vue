<template>
  <h1 class="mb-4 text-center">
    註冊頁面
  </h1>

  <div style="display: flex; justify-content: space-between;">
    <a
      class="btn btn-lg btn-info w-100 mb-4"
      href="/api/google/login"
      target="_blank"
    >
      第三方註冊
    </a>
              　　　
    <button
      class="mb-4 text-center btn btn-lg btn-primary w-100"
      type="submit"
      style="height: 200px;"
    >
      非第三方註冊
    </button>
  </div>

  <div class="text-end login-buttom" />
</template>

<script setup>
import {googleLogin} from "../../apis/auth.js";

const onGoogleLogin = async () => {
  const resp = await googleLogin()

  console.log(resp)
}
</script>
