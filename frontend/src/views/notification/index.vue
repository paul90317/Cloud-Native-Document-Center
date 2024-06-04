<template>
  <div class="container text-center pt-4">
    <div class="row mb-4">
      <div class="col-12 col-md-8 mx-auto row">
        <div class="col-12 col-sm-4">
          <h3>通知列表</h3>
        </div>
        <div class="col-12 col-sm-8">
          <select
            v-model="type"
            class="form-select"
            @change="fetchData"
          >
            <option value="">
              全選
            </option>
            <option
              v-for="(value, key) in FILE_STATUS"
              :key="key"
              :value="key"
            >
              {{ value }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <hr class="row mx-auto w-75">

    <div class="row">
      <div v-if="data.length > 0" class="col-12 col-sm-10 col-md-8 mx-auto list-group text-start">
        <div
          v-for="item in data"
          :key="item"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          @click="goToReview(item)"
        >
          <div class="d-flex align-items-center">
            <i class="bi bi-bell-fill me-2" />
            <span v-if="item?.type" class="badge bg-success rounded-pill me-2">
              {{ FILE_STATUS[item.type] }}
            </span>
            <span v-if="item?.ufrom" class="badge bg-secondary rounded-pill me-2">
              {{ `from: ${item.ufrom}` }}
            </span>
            <span v-if="item?.uto" class="badge bg-primary rounded-pill me-2">
              {{ `to: ${item.uto}` }}
            </span>
            {{ item?.message ?? '' }}
          </div>
          <div>
            {{ formatDateTime(item.createdAt) }}
          </div>
        </div>
      </div>
      <div v-else>
        <p class="col-12 text-center">
          尚無通知
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { getLogs } from '@/apis/review';
import { getInfo } from '@/apis/user';
import { FILE_STATUS } from '@/utils/fileStatus';

export default {
  data() {
    return {
      data: [],
      count: 0,
      type: '',
      username: '',
      FILE_STATUS
    }
  },
  async mounted() {
    await this.fetchInfo()
    await this.fetchData()
  },
  methods: {
    async fetchInfo() {
      try {
        const res = await getInfo()
        this.username = res?.data?.account
      } catch (error) {
        console.error(error)
      }
    },
    async fetchData() {
      try {
        const res = await getLogs({
          type: this.type?.trim() !== "" ? this.type : undefined
        })

        this.data = res?.data?.filter(item => item?.type === 1 && item?.uto === this.username) ?? []
        this.count = this.data?.length ?? 0
      } catch (error) {
        console.error(error)
      }
    },
    formatDateTime(dateTime) {
      if (!dateTime) return '';

      let date = new Date(dateTime);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    },
    goToReview(item) {
      console.log('notification: ', item)
      this.$router.push({
        name: 'file.review',
        params: {
          id: item?.document
        }
      })
    }
  }
}
</script>
