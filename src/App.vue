<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <div class="container">
    <Navbar />
    <router-view />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  min-width: 100vw;
  padding: 0;
}
</style>
