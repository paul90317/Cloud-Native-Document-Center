import request from '@/utils/request/user'

/**
 * JWT 驗證成功的話會回傳使用者在資料庫中的基本資料 (in users)，否則回傳狀態碼 401。
 * @param {Headers} Cookie token=<JWT 憑證>
 * @returns {object}
{
    "acount": "<帳號>",
    "email": "<電子郵件>",
    "name": "<名稱>",
    "phone": "<電話>",
    "profile": "<自我介紹>"
    "manager": "<是否為管理員:bool>"
}
 */
export function getInfo() {
  return request({
    url: '/info',
    method: 'GET'
  })
}

/**
 * JWT 驗證成功的話會更新使用者在資料庫中的基本資料 (in users)，否則回傳狀態碼 401。
 * @param {Headers} Cookie token=<JWT 憑證>
 * @param {object} data 
{
    "acount": "<帳號>",
    "name": "<名稱?>",
    "phone": "<電話?>",
    "profile": "<自我介紹?>"
}
 * @returns 
 */
export function patchInfo(data) {
  return request({
    url: '/info',
    method: 'PATCH',
    data
  })
}

/**
 * 重設 JWT 擁有者的密碼
 * @param {Headers} Cookie token=<JWT 憑證>
 * @param {object} data 
{
    "passwd": "<密碼雜湊>"
}
 * @returns 
 */
export function resetPassword(data) {
  return request({
    url: '/reset/password',
    method: 'POST',
    data
  })
}

/**
 * 當 JWT 擁有者為管理者時，將指定帳號設為管理員。
 * @param {Headers} Cookie token=<JWT 憑證>
 * @param {string} account 
 * @returns 
 */
export function setManager(account) {
  return request({
    url: `/manager/${account}`,
    method: 'POST',
  })
}

/**
 * JWT 驗證通過，回傳所有使用者在資料庫中的基本資料 (in users)，否則回傳狀態碼 401。
 * @param {Headers} Cookie token=<JWT 憑證>
 * @returns {Array}
[
    {
        "acount": "<帳號>",
        "email": "<電子郵件>",
        "name": "<名稱>",
        "phone": "<電話>",
        "profile": "<自我介紹>"
        "manager": "<是否為管理員:bool>"
    }
]
 */
export function getAllUserInfo() {
  return request({
    url: '/users',
    method: 'GET'
  })
}

// `/admin`: 一般情況不使用
// `secret`: 一般情況不使用