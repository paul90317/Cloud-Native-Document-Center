<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        Document Center
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbarNav" class="collapse navbar-collapse justify-content-between text-end">
        <ul class="navbar-nav">
          <template
            v-for="route in routes"
            :key="route.path"
          >
            <li v-if="route?.children" class="nav-item dropdown">
              <a
                :id="route.title"
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ route.title }}
              </a>
              <ul class="dropdown-menu ms-auto w-50" :aria-labelledby="route.title">
                <li
                  v-for="child in route.children"
                  :key="child.path"
                >
                  <router-link
                    :to="child.path"
                    class="dropdown-item text-start"
                  >
                    {{ child.title }}
                  </router-link>
                </li>
              </ul>
            </li>
            <li v-else class="nav-item">
              <router-link
                :to="route.path"
                class="nav-link"
              >
                {{ route.title }}
              </router-link>
            </li>
          </template>
        </ul>

        <ul v-if="isLogin" class="navbar-nav">
          <li>
            <button class="btn btn-outline-success my-1" @click="onLogout">
              Logout
            </button>
          </li>
        </ul>
        <ul v-else class="navbar-nav">
          <li>
            <router-link v-slot="{href, navigate, }" to="/login">
              <a
                :href="href"
                class="btn btn-outline-primary my-1"
                @click="navigate"
              >Login</a>
            </router-link>
          </li>
          <li>
            <router-link v-slot="{href, navigate, }" to="/SignUp">
              <a
                :href="href"
                class="btn btn-outline-secondary my-1 ms-2"
                @click="navigate"
              >Register</a>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useUserStore } from "@/stores/user.js";

export default {
  data() {
    return {
      routes: [],
      userState: useUserStore()
    }
  },
  computed: {
    isLogin() {
      return this.userState?.getAccessToken !== null
    }
  },
  mounted() {
    this.routes = this.$router.options.routes.filter(route => !route?.isHidden) ?? []
  },
  methods: {
    onLogout() {
      this.userState?.logout()
      this.$router.push({ name: 'Home' })
    }
  }
}

</script>

<style></style>
