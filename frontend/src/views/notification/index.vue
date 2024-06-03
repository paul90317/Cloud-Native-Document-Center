<template>
  <div class="container text-center pt-4">
    <div class="row mb-4">
      <div class="col-4 col-sm-3 col-lg-2">
        <h3>通知列表</h3>
      </div>
      <div class="col-8 col-sm-9 col-lg-10">
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
    <div class="row">
      <div v-if="data.length > 0" class="col-12 col-sm-10 col-md-8 mx-auto list-group text-start">
        <div
          v-for="item in data"
          :key="item"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        >
          <div class="d-flex align-items-center">
            <i class="bi bi-bell-fill me-2" />
            <span v-if="item?.type" class="badge bg-success rounded-pill me-2">
              {{ FILE_STATUS[item.type] }}
            </span>
            <span v-if="item?.ufrom" class="badge bg-secondary rounded-pill me-2">
              {{ item.ufrom }}
            </span>
            <span v-if="item?.uto" class="badge bg-primary rounded-pill me-2">
              {{ item.uto }}
            </span>
            {{ item?.message ?? '' }}
          </div>
          <div>
            {{ item.time }}
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
import { FILE_STATUS } from '@/utils/fileStatus';

export default {
  data() {
    return {
      data: [],
      count: 0,
      type: null,
      FILE_STATUS
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const res = await getLogs({
          type: this.type?.trim() !== "" ? this.type : undefined
        })

        this.data = res?.data ?? []
        this.count = this.data?.length ?? 0
      } catch (error) {
        console.error(error)
      }
    },
  }
}
</script>
