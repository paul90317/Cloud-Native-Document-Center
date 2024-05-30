<template>
  <div class="container text-center pt-4">
    <div class="row mb-4">
      <div class="col">
        <h3>檔案列表</h3>
      </div>
    </div>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div
        v-for="item in data"
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
                aria-label="Edit group"
              >
                <!-- edit view permission -->
                <button class="btn btn-outline-secondary" @click="onClickEditView(item.id)">
                  <i class="bi bi-gear-wide-connected" />
                </button>
                <!-- edit review permission -->
                <button class="btn btn-outline-secondary" @click="onClickEditReview(item.id)">
                  <i class="bi bi-person-fill-gear" />
                </button>
              </div>
              <div
                class="btn-group"
                role="group"
                aria-label="Operation group"
              >
                <button class="btn btn-outline-success" @click="onClickEdit(item.id)">
                  <i class="bi bi-pencil-square" />
                </button>
                <button class="btn btn-outline-danger" @click="onClickDelete(item.id)">
                  <i class="bi bi-trash3" />
                </button>
              </div>
            </ul>
          </div>
          <div class="card-body text-start">
            <h5 class="card-title">
              {{ item.docname }}
            </h5>
            {{ `status: ${item.status}` }}
            <div
              class="btn-group"
              role="group"
              aria-label="First group"
            >
              <button class="btn btn-outline-success" @click="showDocumentProfile">
                <i class="bi bi-info-square" />
              </button>
              <document-profile
                v-if="showModal"
                ref="documentProfile"
                @close="hideDocumentProfile"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllFiles } from '@/apis/file';
import DocumentProfile from '@/components/document_info.vue';

export default {
  components: {
    DocumentProfile
  },
  data() {
    return {
      showModal: false,
      data: []
    };
  },
  async mounted() {
    const response = await getAllFiles()
    console.log(response)
    this.data = response?.data || []
  },
  methods: {
    showDocumentProfile() {
      this.showModal = !this.showModal;
    },
    hideDocumentProfile() {
      this.showModal = false;
    },
    onClickDelete(id) {
      console.log('delete', id)
    },
    onClickEdit(id) {
      console.log('edit', id)
      this.$router.push({ name: 'file.edit' })
    },
    onClickEditView(id) {
      console.log('edit view', id)
      this.$router.push({ name: 'file.edit.reviewer' })
    },
    onClickEditReview(id) {
      console.log('edit review', id)
      this.$router.push({ name: 'file.edit.permission' })
    }
  }
};
</script>