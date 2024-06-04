<template>
  <div class="container pt-4">
    <div class="row mb-4">
      <div class="col">
        <h3 class="text-center">
          文件列表
        </h3>
        <button
          type="button"
          class="btn btn-outline-success float-end"
          @click="onCreateFile"
        >
          創建文件
        </button>
      </div>
    </div>

    <hr class="row mx-auto w-75">

    <div v-if="data?.length > 0" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2 g-lg-4">
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
                <button
                  type="button"
                  class="btn btn-outline-success"
                  data-bs-target="#exampleModal"
                  @click="launchModal(item.id)"
                >
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
            <span v-if="item?.status" :class="['badge rounded-pill', FILE_STATUS_BADGE[item.status] ?? 'bg-secondary']">
              {{ FILE_STATUS[item.status] ?? '未知狀態' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="row">
      <div class="col">
        <p class="text-center">
          尚無檔案
        </p>
      </div>
    </div>
    <DocumentProfile ref="exampleModal" :number-param="currentId" />
  </div>
</template>

<script>
import { deleteFile, getAllFiles } from '@/apis/file';
import DocumentProfile from '@/components/document_info.vue';
import { FILE_STATUS } from '@/utils/fileStatus';
import { ref } from 'vue';

let thisModal= ref(null);

const FILE_STATUS_BADGE = {
  0: 'bg-secondary',
  1: 'bg-primary',
  2: 'bg-danger',
  3: 'bg-success',
}

export default {
  components: {
    DocumentProfile
  },
  data() {
    return {
      showModal: false,
      data: [],
      FILE_STATUS,
      FILE_STATUS_BADGE,
      currentId: null,
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
    async onDelete(id) {
      console.log('delete', id)
      if (!id) return

      const yes = confirm('確定刪除？')
      if (!yes) return
      
      try {
        const response = await deleteFile(id)
        if (response?.status !== 200) throw new Error(response)

        alert('刪除成功')
        this.fetchFileList()
      } catch (error) {
        console.error(error)
        alert('刪除失敗')
      }
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
    onCreateFile() {
      this.$router.push({ name: 'file.create' })
    },
    launchModal(id) {
      this.currentId = id;
      this.$refs.exampleModal.showModal();
    },
  }
};
</script>