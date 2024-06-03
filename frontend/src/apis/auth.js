import request from '@/utils/request/auth'

/**
 * 用來第三方登入用的，會希望可以透過反向代理直接和瀏覽器互動。
 * 
 * 經過預處裡後會重導向到 gmail 選擇畫面 https://accounts.google.com/o/oauth2/v2/auth?...
 * 
 * 接著重導向到 http://localhost/google/login/callback?code=...
 * 
 * 反向代理到 http://auth/google/login/callback?code=...
 * 
 * 以下只定義重導向之前的行為。
 * @returns {Headers} Location	https://accounts.google.com/o/oauth2/v2/auth?...
 */
export function googleLogin() {
  return request({
    url: '/google/login',
    method: 'GET',
  })
}


/**
 * 這是專門讓 google 帳戶選擇畫面 (瀏覽器端) 重導向的，需要被反向代理。
 * 
 * google 會附帶一次性密碼參數，可用該一次性密碼參數再向 google 換到選擇的 email，確認 email 在資料庫存在時會成功，給予 JWT 憑證並回傳 200，否則回傳 401。
 * @param {string} code 
 * @returns {Headers} Set-Cookie	token=<JWT 憑證>
 */
export function googleLoginCallback(code) {
  return request({
    url: '/google/login/callback',
    method: 'GET',
    params: { code }
  })
}

/**
 * 用來在登入狀態 (也就是有 JWT 憑證) 綁定帳戶用的，會希望可以透過反向代理直接和瀏覽器互動。
 * 
 * 經過預處裡後會重導向到 gmail 選擇畫面 https://accounts.google.com/o/oauth2/v2/auth?...
 * 
 * 接著重導向到 http://localhost/google/bind/callback?code=... ，反向代理到 http://auth/google/bind/callback?code=...。
 * 
 * 以下只定義重導向之前的行為。
 * @returns 
 */
export function googleBind() {
  return request({
    url: '/google/bind',
    method: 'GET',
  })
}

/**
 * 這是專門讓 google 帳戶選擇畫面 (瀏覽器端) 重導向的，需要被反向代理。
 * 
 * google 會附帶一次性密碼參數，可用該一次性密碼參數再向 google 換到選擇的 email，
 * 
 * 若驗證失敗回傳 401，gmail 已存在回傳 400，否則回傳 200，並綁定 gmail。
 * @param {Headers} Cookie  token=<JWT 憑證>
 * @param {string} code 
 * @returns 
 */
export function googleBindCallback(code) {
  return request({
    url: '/google/bind/callback',
    method: 'GET',
    params: { code }
  })
}

/**
 * 登入帳號，當給定帳號存在並且密碼相同就會成功，成功會給予憑證 JWT
 * @param {object} data 
{
    "account": "<帳號>",
    "passwd": "<密碼雜湊>"
}
 * @returns {Headers} Set-Cookie	token=<JWT 憑證>
 */
export function localLogin(data) {
  return request({
    url: '/local/login',
    method: 'POST',
    data
  })
}

/**
 * 呼叫端給予帳號和密碼雜湊以註冊新帳號，當帳號不重複就會註冊成功。
 * @param {object} data 
{
    "account": "<帳號>",
    "passwd": "<密碼雜湊>"
}
 * @returns 
 */
export function logalRegister(data) {
  return request({
    url: '/local/register',
    method: 'POST',
    data
  })
}