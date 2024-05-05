<template>
  <div class="container">
      <div class="row pt-3">
          <div class="col"></div>
          <div class="col-4">

          </div>
          <div class="col-3 my-auto">
              <form id="form">
                  
                  <h1 class="mb-4 text-center">登入頁面</h1>
                  帳號
                  <input type="text" placeholder="請輸入帳號名稱" class="mb-3 px-3 pe-4 py-2" />
                  密碼
                  <input type="password" placeholder="請輸入密碼" class="mb-4 px-3 pe-4 py-2" />
                  <button class="mb-4 text-center btn btn-lg btn-primary w-100" type="submit">
                      登入
                  </button>
                  <router-link to="../test3">
                      <button class="mb-4 text-center btn btn-lg btn-primary w-100" type="submit">
                          註冊
                      </button>
                  </router-link>
                  <div class="text-end login-buttom">
                      <RouterLink to="/register">第三方登入</RouterLink>
                  </div>    
              </form>
          </div>
          <div class="col"></div>
      </div>
  </div>
</template>