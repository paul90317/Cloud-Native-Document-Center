<script setup>
</script>

<template>
  <div class="container text-center">
    <div class="row">
      <h2>審核文件</h2>
      <div class="col-8 mx-auto">
        這邊放read-only的文字編輯器
      </div>
      <div class="col-8 mx-auto">
        <form class="mb-2">
          <div class="form-floating">
            <textarea
              id="comment"
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
              <button type="button" class="btn btn-success">
                通過
              </button>
              <button type="button" class="btn btn-danger">
                拒絕
              </button>
            </div>
          </div>
          <div class="col-12 col-sm-auto mt-2">
            <div
              class="btn-group"
              role="group"
            >
              <button type="button" class="btn btn-outline-secondary">
                保留
              </button>
              <button type="button" class="btn btn-outline-primary">
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>