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
        <template v-if="!isLogin">
          <router-link v-slot="{ href, navigate }" to="/login">
            <a
              :href="href"
              class="btn btn-outline-primary my-1"
              @click="navigate"
            >Login</a>
          </router-link>
          <router-link v-slot="{ href, navigate }" to="/register">
            <a
              :href="href"
              class="btn btn-outline-secondary my-1 ms-2"
              @click="navigate"
            >Register</a>
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { useUserStore } from "@/stores/user.js";

export default {
  computed: {
    isLogin() {
      const userState = useUserStore()
      return userState?.getAccessToken !== null
    }
  },
}
</script>