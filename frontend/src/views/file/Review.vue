<template>
  <div class="container text-center pt-4">
    <div class="row">
      <h2>審核文件</h2>
      <div class="col-8 mx-auto mb-3">
        <div class="row">
          <div class="col-12 text-start">
            <span>{{ `title: ${file.docname}` }}</span>
          </div>
          <div class="col-12">
            <Editor :submit-and-clear-editor="file.content" disabled />
          </div>
        </div>
      </div>
      <div class="col-8 mx-auto mb-3">
        <form class="mb-2">
          <div class="form-floating">
            <textarea
              id="comment"
              v-model="comment"
              class="form-control"
              placeholder="Leave a comment here"
              style="height: 100px"
            />
            <label for="comment">Comments</label>
          </div>
        </form>
      </div>
      <div class="col-8 mx-auto">
        <div class="row d-flex justify-content-center">
          <div class="col-12 col-sm-auto mr-auto mt-2">
            <div
              class="btn-group"
              role="group"
            >
              <button
                type="button"
                class="btn btn-success"
                @click="onPass"
              >
                通過
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click="onReject"
              >
                拒絕
              </button>
            </div>
          </div>
          <div class="col-12 col-sm-auto mt-2">
            <div
              class="btn-group"
              role="group"
            >
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="$router.go(-1)"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getFile } from "@/apis/file.js";
import { reviewFile } from "@/apis/review.js";
import Editor from '@/components/Editor.vue';

export default {
  components: {
    Editor,
  },
  data() {
    return {
      fileId: null,
      file: {
        docname: "",
        content: "",
      },
      comment: "",
    };
  },
  mounted() {
    this.fileId = this.$route.params.id;
    this.fetchFile();
  },
  methods: {
    async fetchFile() {
      try {
        const resp = await getFile(this.fileId);
        if (resp?.status !== 200) throw new Error(resp);

        const {docname, content} = resp.data;
        this.file = {docname, content};
      } catch (error) {
        console.error(error);
      }
    },
    async onPass() {
      console.log(this.fileId, this.comment)
      const yes = confirm("確定通過？");
      if (!yes) return;

      try {
        const data = {
          status: 3,
        }
        const response = await reviewFile(this.fileId, data);
        if (response?.status !== 200) throw new Error(response);

        alert("審核通過成功");
      } catch (error) {
        console.error(error);
        alert("審核通過失敗");
      }
    },
    async onReject() {
      console.log(this.fileId, this.comment)
      const yes = confirm("確定拒絕？");
      if (!yes) return;

      try {
        const data = {
          status: 2,
          message: this.comment,
        }
        const response = await reviewFile(this.fileId, data);
        if (response?.status !== 200) throw new Error(response);

        alert("審核拒絕成功");
      } catch (error) {
        console.error(error);
        alert("審核拒絕失敗");
      }    
    },
  },
};
</script>