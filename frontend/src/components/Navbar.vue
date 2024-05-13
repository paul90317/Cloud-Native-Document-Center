<script setup>
import { useRouter } from 'vue-router';
const routes = useRouter().options.routes
</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
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
      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <li
            v-for="route in routes"
            :key="route.path"
            class="nav-item"
          >
            <router-link
              v-if="!route?.isHidden"
              :to="route.path"
              class="nav-link"
            >
              {{ route.title }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style></style>
