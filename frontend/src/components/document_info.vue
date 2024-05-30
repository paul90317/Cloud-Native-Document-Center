<template>
  <div v-if="showModal" class="modal">
    <div class="container">
      <button class="btn btn-danger" @click="hide">
        Close
      </button>
      <div class="row2">
        <div class="col">
          <div class="modal-content">
            <h2>{{ info.title }}</h2>
            <p>{{ info.content }}</p>
          </div>
        </div>
      </div>
      <div
        v-for="message in messages"
        :key="message.id"
        class="row"
      >
        <div class="col">
          <div class="modal-content">
            <h2>{{ message.title }}</h2>
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      messages: [],
      showModal: true,
    };
  },
  created() {
    this.fetchMessages();
    this.fetchInfo();
  },
  methods: {
    fetchInfo() {
      this.info = { id: 1, title: 'document information', content: ' some information about the document' }
    },
    fetchMessages() {
      this.messages = [
        { id: 1, title: '審核情形1', content: '這是第一份送審記錄的內容...' },
        { id: 2, title: '審核情形1', content: '這是第一份送審記錄的內容...' },
        { id: 3, title: '審核情形1', content: '這是第一份送審記錄的內容...' },
        { id: 4, title: '審核情形1', content: '這是第一份送審記錄的內容...' },
        { id: 5, title: '審核情形2', content: '這是第二份送審記錄的內容...' }
      ];
    },
    show() {
      this.showModal = true;
    },
    hide() {
      this.$emit('close');
    }
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 500px;
  max-height: 80vh; /* Set a max height */
  overflow-y: auto; /* Add scroll if content overflows */
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
}

.row {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
.row2 {
  background-color: #ff6347; /* Tomato color */
  border: 1px solid #000; /* Black border */
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
.modal-content h2 {
  text-align: center;
  color: #333;
}

.modal-content p {
  text-align: justify;
  color: #666;
}
</style>