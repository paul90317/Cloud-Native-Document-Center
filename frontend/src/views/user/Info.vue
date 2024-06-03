<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h2 class="text-center mb-4">
              帳號資料
            </h2>
            <form>
              <div class="form-group mb-3">
                <label for="account">帳號</label>
                <input
                  id="account"
                  v-model="info.account"
                  type="text"
                  class="form-control"
                  disabled
                >
              </div>
              <div class="form-group mb-3">
                <label for="email">電子郵件</label>
                <input
                  id="email"
                  v-model="info.email"
                  disabled
                  type="email"
                  class="form-control"
                >
              </div>
              <div class="form-group mb-3">
                <label for="name">暱稱</label>
                <input
                  id="name"
                  v-model="info.name"
                  type="text"
                  class="form-control"
                  disabled
                >
              </div>
              <div class="form-group mb-3">
                <label for="phone">手機號碼</label>
                <input
                  id="phone"
                  v-model="info.phone"
                  type="tel"
                  class="form-control"
                  disabled
                >
              </div>
              <div class="form-group mb-3">
                <label for="profile">自我介紹</label>
                <textarea
                  id="profile"
                  v-model="info.profile"
                  class="form-control"
                  disabled
                />
              </div>
              <div class="form-group mb-3">
                <label for="manager">管理者身分</label>
                <input
                  id="manager"
                  v-model="info.manager"
                  type="text"
                  class="form-control"
                  disabled
                >
              </div>
            </form>
            <div class="text-center">
              <button
                class="btn btn-primary"
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

<script setup>
import { getInfo } from '@/apis/auth';
import { onMounted, reactive } from 'vue';

const info = reactive({
  account: '',
  email: '',
  name: '',
  phone: '',
  profile: '',
  manager: '否',
})

onMounted(async () => {
  try {
    const response = await getInfo()
    if (response?.status === 200) {
      info.account = response.data.account
      info.email = response.data.email
      info.name = response.data.name
      info.phone = response.data.phone
      info.profile = response.data.profile
      info.manager = response.data.manager ? '是' : '否'
    }
  } catch (error) {
    console.error(error)
    // handle error
  }
})
</script>