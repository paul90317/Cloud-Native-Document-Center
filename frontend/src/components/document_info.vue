<template>
  <div  class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true" ref="exampleModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Document details</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div v-for="message in messages" :key="message.id" class="modal-message">
          <h5>{{ message.message }}</h5>
          <p>From : {{ message.ufrom }}</p>
          <p v-if="message.uto">To : {{ message.uto }}</p>
          <p>{{ formatDateTime(message.updatedAt) }}</p>
        </div>
        <div class="modal-footer">
          <!--  data-bs-dismiss="modal" -->
          <button type="button" class="btn btn-secondary" @click="hideModal()">
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
    };
  },
  methods: {
    async fetch_data() {
      try {
        const response = await getLogs({ document: this.numberParam })
        this.messages = response.data;
        if (response?.status !== 200) throw new Error(response)
        this.data = response?.data || []
        console.log(response)
        console.log(this.messages)
      } catch (error) {
        console.error(error)
      }
    },
    showModal() {
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
  mounted() {
    this.fetch_data()
    this.modal = new Modal(this.$refs.exampleModal);
  },
};
</script>

<style scoped>
.modal-message {
  background-color: #f0f0f0; /* 淺灰色背景 */
  border: 5px solid #17a2b8; /* Bootstrap 的 info 顏色 */
  padding: 2rem; /* Bootstrap 的 p-3 對應的大小 */
  margin-bottom: 2rem; /* Bootstrap 的 mb-3 對應的大小 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加淡淡的陰影效果 */
  border-radius: 8px; /* 圓角 */
}
</style>