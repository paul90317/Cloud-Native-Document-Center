<script setup>
import { ref } from 'vue';

const count = ref(6)
</script>

<template>
  <div class="container text-center">
    <div class="row mb-4">
      <div class="col">
        <h3>通知列表</h3>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-sm-10 col-md-8 mx-auto list-group text-start">
        <a
          v-for="item in count"
          :key="item"
          href="#"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        >
          <div class="d-flex align-items-center">
            <i class="bi bi-bell-fill me-2" />
            <span class="badge bg-primary rounded-pill me-2">
              type
            </span>
            First checkbox
          </div>
          <a href="" class="btn btn-outline-danger">
            <i class="bi bi-trash3" />
          </a>
        </a>
      </div>
    </div>
  </div>
</template>