<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <div class="container-fluid min-vh-100">
    <Navbar class="sticky-top mb-4" />
    <router-view />
  </div>
</template>
