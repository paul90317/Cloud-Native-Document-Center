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
                <button
                  class="btn btn-outline-secondary"
                  :disabled="disabledEditPermission"
                  @click="onEditPermission(item.id)"
                >
                  <i class="bi bi-gear-wide-connected" />
                </button>
                <button
                  type="button"
                  class="btn btn-outline-success"
                  data-bs-target="#exampleModal"
                  :disalbed="disabledReviewHistory"
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
                <button
                  class="btn btn-outline-success"
                  :disabled="disabledEdit"
                  @click="onEdit(item.id)"
                >
                  <i class="bi bi-pencil-square" />
                </button>
                <button
                  class="btn btn-outline-danger"
                  :disabled="disabledDelete"
                  @click="onDelete(item.id)"
                >
                  <i class="bi bi-trash3" />
                </button>
              </div>
            </ul>
          </div>
          <div class="card-body text-start">
            <h5 class="card-title">
              {{ item.docname }}
            </h5>
            <span v-if="item?.status in FILE_STATUS" :class="['badge rounded-pill', FILE_STATUS_BADGE[item.status] ?? 'bg-secondary']">
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
import { deleteFile, getAllFiles, getfilemembers } from '@/apis/file';
import { getInfo } from '@/apis/user';
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
      account: '',
      manager: false,
      FILE_STATUS,
      FILE_STATUS_BADGE,
      currentId: null,
    };
  },
  computed: {
    disabledEditPermission() {
      return false
    },
    disabledReviewHistory() {
      return false
    },
    disabledEdit() {
      return false
    },
    disabledDelete() {
      return false
    },
  },
  async mounted() {
    await this.fetchInfo()
    await this.fetchFileList()
    await this.fetchFileMember()
  },
  methods: {
    async fetchInfo() {
      try {
        const response = await getInfo()
        if (response?.status !== 200) throw new Error(response)
        this.account = response?.data?.account || ''
        this.manager = response?.data?.manager || false
      } catch (error) {
        console.error(error)
      }
      console.log(this.account)
    },
    async fetchFileList() {
      try {
        const response = await getAllFiles()
        if (response?.status !== 200) throw new Error(response)
        this.data = response?.data.reduce((unique, item) => {
          return unique.some(doc => doc['doc-id'] === item['doc-id']) ? unique : [...unique, item];
        }, []) || [];     
      } catch (error) {
        console.error(error)
      }
    },
    async fetchFileMember() {
      for (const item of this.data) {
        try {
          const response = await getfilemembers(item.id)
          if (response?.status !== 200) throw new Error(response)
          item.members = response?.data || []
        } catch (error) {
          console.error(error)
        }
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