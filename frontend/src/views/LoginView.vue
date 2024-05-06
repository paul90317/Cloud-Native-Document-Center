<template>
  <div class="container">
    <div class="row pt-3 justify-content-center">
      <div class="col-3 my-auto text-center">
        <form id="form">
          <h1 class="mb-4 text-center" style="white-space: nowrap;">
            登入頁面
          </h1>
          <div class="text-center" style="white-space: nowrap;">
            帳號
          </div>
          <input
            type="text"
            placeholder="請輸入帳號名稱"
            class="mb-3 px-3 pe-4 py-2"
          >
          <div class="text-center" style="white-space: nowrap;">
            密碼
          </div>
          <input
            type="password"
            placeholder="請輸入密碼"
            class="mb-4 px-3 pe-4 py-2"
          >
          <button class="mb-4 text-center btn btn-lg btn-primary w-100" type="submit">
            登入
          </button>
          <router-link to="../test3">
            <button class="mb-4 text-center btn btn-lg btn-primary w-100" type="submit">
              註冊
            </button>
          </router-link>
          <div class="text-end login-buttom">
            <RouterLink to="/register">
              第三方登入
            </RouterLink>
          </div>    
        </form>
      </div>
    </div>
  </div>
</template>