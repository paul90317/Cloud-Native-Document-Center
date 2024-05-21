<script setup>
import { localLogin, logalRegister } from '@/apis/auth';
import { onMounted } from 'vue';

onMounted(async () => {
  const registerResponse = await logalRegister({
    account: 'test1',
    passwd: 'test1',
  })
  console.log(registerResponse)

  const loginResponse = await localLogin({
    account: 'test1',
    passwd: 'test1',
  })
  console.log(loginResponse);
});
</script>

<template>
  <div class="m-4 p-5 bg-light rounded-3">
    <div class="container py-4">
      <div class="col-12 py-4 col-sm-10 col-md-8 mx-auto">
        <h1 class="display-5 fw-bold">
          Document Center
        </h1>
        <p>
          A simple document management system
        </p>
        <router-link v-slot="{href, navigate, }" to="/login">
          <a
            :href="href"
            class="btn btn-outline-primary my-1"
            @click="navigate"
          >Login</a>
        </router-link>
        <router-link v-slot="{href, navigate, }" to="/register">
          <a
            :href="href"
            class="btn btn-outline-secondary my-1 ms-2"
            @click="navigate"
          >Register</a>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
