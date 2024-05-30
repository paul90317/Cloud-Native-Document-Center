<template>
  <div class="container text-center pt-4">
    <div class="row mb-4">
      <div class="col">
        <h3>檔案列表</h3>
      </div>
    </div>
    <div class="row row-cols-1 row-cols-xs-2 row-cols-md-3 row-cols-lg-4 g-4">
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
                <button class="btn btn-outline-secondary" @click="onEditPermission(item.id)">
                  <i class="bi bi-gear-wide-connected" />
                </button>
                <!-- edit review permission
                <button class="btn btn-outline-secondary" @click="onEditReview(item.id)">
                  <i class="bi bi-person-fill-gear" />
                </button> -->
                <!-- review history -->
                <button class="btn btn-outline-success" @click="showDocumentProfile(item.id)">
                  <i class="bi bi-info-square" />
                </button>
              </div>
              <div
                class="btn-group"
                role="group"
                aria-label="Operation group"
              >
                <button class="btn btn-outline-success" @click="onEdit(item.id)">
                  <i class="bi bi-pencil-square" />
                </button>
                <button class="btn btn-outline-danger" @click="onDelete(item.id)">
                  <i class="bi bi-trash3" />
                </button>
              </div>
            </ul>
          </div>
          <div class="card-body text-start">
            <h5 class="card-title">
              {{ item.docname }}
            </h5>
            <p v-if="'status' in item">
              {{ `status: ${parseStatus(item.status)}` }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <document-profile
      v-if="showModal"
      ref="documentProfile"
      @close="hideDocumentProfile"
    />
  </div>
</template>

<script>
import { getAllFiles } from '@/apis/file';
import DocumentProfile from '@/components/document_info.vue';
import { FILE_STATUS } from '@/utils/fileStatus';

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
  mounted() {
    this.fetchFileList()
  },
  methods: {
    async fetchFileList() {
      try {
        const response = await getAllFiles()
        if (response?.status !== 200) throw new Error(response)
        this.data = response?.data || []
      } catch (error) {
        console.error(error)
      }
    },
    showDocumentProfile() {
      this.showModal = !this.showModal;
    },
    hideDocumentProfile() {
      this.showModal = false;
    },
    onDelete(id) {
      console.log('delete', id)
    },
    onEdit(id) {
      console.log('edit', id)
      if (!id) return
      this.$router.push({ name: 'file.edit', params: { id }})
    },
    onEditPermission(id) {
      console.log('edit view', id)
      if (!id) return
      this.$router.push({ name: 'file.edit.reviewer', params: { id }})
    },
    parseStatus(status) {
      if (status in FILE_STATUS) {
        return FILE_STATUS[status]
      }
      return '未知狀態'
    },
  }
};
</script>