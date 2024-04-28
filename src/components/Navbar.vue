<script>

</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link to="/" class="navbar-brand">Logo</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item" v-for="route in $router.options.routes" :key="route.path">
            <router-link :to="route.path" class="nav-link">{{ route.name }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style>
</style>