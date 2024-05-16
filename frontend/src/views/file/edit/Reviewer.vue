<script setup>
import { ref } from 'vue';

const count = ref(6)
</script>
<template>
  <div class="container text-center pt-4">
    <h2>
      編輯文件審核者
    </h2>
    <div class="row">
      <div class="col-8 mx-auto">
        <div class="list-group text-start">
          <label
            v-for="item in count"
            :key="item"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              <input
                class="form-check-input me-1"
                type="checkbox"
                value=""
              >
              First checkbox
            </span>
            <span class="badge bg-danger rounded-pill">admin</span>
          </label>
        </div>
      </div>
    </div>
    <div
      class="btn-group mt-4"
      role="group"
    >
      <button type="button" class="btn btn-success">
        送出
      </button>
      <button type="button" class="btn btn-outline-primary">
        返回
      </button>
    </div>
  </div>
</template>