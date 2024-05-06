<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <div class="container-fluid min-vh-100 min-vw-100 p-0">
    <Navbar />
    <router-view />
  </div>
</template>
