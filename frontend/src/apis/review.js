import request from '@/utils/request/review'

/**
 * 當 JWT 擁有者是目標帳號或管理者時，回傳目標帳號須審核的檔案，包含已經審核和未經審核。
 * @param {string} account 
 * @returns {Array}
[
    {
        "user": "<目標帳號>"
        "document": "<文件id:int>",
        "status": "<狀態:int>",
        "message": "<審核訊息:int>"
    }
]
 */
export function getAccountReviewList(account) {
  return request({
    url: `/reviewer/${account}/files`,
    method: 'GET',
  })
}

/**
 * 當 JWT 擁有者是檔案擁有者、觀看者、編輯者、審核者或管理者時，回傳目標文件的審核人員，包含已經審核和未經審核。
 * @param {int} file_id 
 * @returns {Array}
{
    "reviewer": "<審核人員帳號>",
    "status": "<狀態:int>",
    "message": "<訊息>"
}
 */
export function getFileReviewer(file_id) {
  return request({
    url: `/file/${file_id}/reviewer`,
    method: 'GET',
  })
}

/**
 * 當 JWT 擁有者是檔案擁有者或管理者時，重設目標文件的審核人員，並將審核人員的狀態設為等待審核，清空審核訊息。
 * @param {int} file_id 
 * @param {string} account 
 * @param {object} data
{
    "reviewer": "<審核人員帳號>"
}
 */
export function overrideFileReviewer(file_id, account, data) {
  return request({
    url: `/file/${file_id}/reviewer/${account}`,
    method: 'POST',
    data
  })
}

/**
 * 當 JWT 擁有者是檔案擁有者或管理者時，刪除目標文件的指定審核人員，指定審核人員不存在則跳過。
 * @param {int} file_id 
 * @param {string} account 
 * @returns 
 */
export function deleteFileReviewer(file_id, account) {
  return request({
    url: `/file/${file_id}/reviewer/${account}`,
    method: 'DELETE',
  })
}

/**
 * 
 * @param {int} file_id 
 * @param {object} data 
{
    "document": "<文件id:int>",
    "status": "<狀態:int>",
    "message": "<訊息>"
}
 * @returns 
 */
export function reviewFile(file_id, data) {
  return request({
    url: `/review/${file_id}`,
    method: 'POST',
    data
  })
}