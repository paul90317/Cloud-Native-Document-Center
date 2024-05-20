<script setup>
import { ref } from 'vue';

const count = ref(6)

</script>

<template>
  <div class="container text-center pt-4">
    <div class="row mb-4">
      <div class="col">
        <h3>檔案列表</h3>
      </div>
    </div>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div
        v-for="item in count"
        :key="item"
        class="col"
      >
        <div class="card text-center p-0">
          <div class="card-header">
            <ul
              class="nav nav-pills card-header-pills btn-toolbar justify-content-between"
              role="toolbar"
              aria-label="Toolbar with button groups"
            >
              <div
                class="btn-group"
                role="group"
                aria-label="First group"
              >
                <a class="btn btn-outline-secondary" href="#"><i class="bi bi-gear-wide-connected" /></a>
                <a class="btn btn-outline-secondary" href="#"><i class="bi bi-person-fill-gear" /></a>
              </div>
              <div
                class="btn-group"
                role="group"
                aria-label="First group"
              >
                <a class="btn btn-outline-success" href="#"><i class="bi bi-pencil-square" /></a>
                <a class="btn btn-outline-danger" href="#"><i class="bi bi-trash3" /></a>
              </div>
            </ul>
          </div>
          <div class="card-body text-start">
            <h5 class="card-title">
              檔名
            </h5>
            <div
                class="btn-group"
                role="group"
                aria-label="First group"
              >
                <button class="btn btn-outline-success" @click="showDocumentProfile"><i class="bi bi-info-square" /></button>
                <document-profile v-if="showModal" ref="documentProfile" @close="hideDocumentProfile" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import DocumentProfile from '@/components/document_info.vue';

export default {
  data() {
    return {
      showModal: false
    };
  },
  components: {
    DocumentProfile
  },
  methods: {
    showDocumentProfile() {
      this.showModal = !this.showModal;
    },
    hideDocumentProfile() {
      this.showModal = false;
    }
  }
  
};
</script>