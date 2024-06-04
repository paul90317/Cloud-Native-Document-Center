<template>
  <div
    id="exampleModalLong"
    ref="exampleModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLongTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Document details
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <template v-if="messages?.length > 0">
          <div
            v-for="message in messages"
            :key="message.id"
            class="modal-message"
          >
            <h3 v-if="message.type === 2" class="mb-1">
              拒絕
            </h3>
            <h3 v-if="message.type === 3" class="mb-1">
              通過
            </h3>
            <h4 class="my-2">
              {{ `message: ${message.message}` }}
            </h4>
            <p class="mb-1">
              From : {{ message.ufrom }}
            </p>
            <p v-if="message.uto" class="mb-1">
              To : {{ message.uto }}
            </p>
            <p class="mb-1">
              {{ formatDateTime(message.updatedAt) }}
            </p>
          </div>
        </template>
        <div v-else class="w-100 text-center">
          <p>尚無審核紀錄</p>
        </div>
        <div class="modal-footer">
          <!--  data-bs-dismiss="modal" -->
          <button
            type="button"
            class="btn btn-secondary"
            @click="hideModal()"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal';
import { getLogs } from "../apis/review.js";

export default {
  props: {
    numberParam: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      modal: {},
      messages: [],
    };
  },
  mounted() {
    this.modal = new Modal(this.$refs.exampleModal);
  },
  methods: {
    async fetch_data() {
      try {
        const response = await getLogs({ document: this.numberParam })
        if (response?.status !== 200) throw new Error(response)

        this.messages = response?.data ?? [];
        console.log(response)
        console.log(this.messages)
      } catch (error) {
        console.error(error)
      }
    },
    showModal() {
      this.fetch_data()
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    },
    formatDateTime(dateTime) {
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
  },
};
</script>

<style scoped>
.modal-message {
  background-color: #f0f0f0; /* 淺灰色背景 */
  border: 5px solid #17a2b8; /* Bootstrap 的 info 顏色 */
  margin: 2rem; /* Bootstrap 的 p-3 對應的大小 */
  /* Bootstrap 的 mb-3 對應的大小 */
  /* margin-bottom: 2rem; */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加淡淡的陰影效果 */
  border-radius: 8px; /* 圓角 */
}
</style>