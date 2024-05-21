import request from '@/utils/request/file'

/**
 * Get filenames & ids of all docs uploaded by the user.
 * @returns {object}
[
  {
    "filename": "string",
    "id": "string",
    "status": 0
  }
]
 */
export function getAllFiles() {
  return request({
    url: '/docs/all',
    method: 'GET',
  })
}

/**
 * This route is used to create a new doc.
 * @param {object} data
{
  "filename": "string",
  "creator": "string"
  "file": "string" ($binary)
}
 * @returns {object}
{
  "id": "string"
}
 */
export function createEmptyDoc(data) {
  return request({
    url: '/docs/create',
    method: 'POST',
    data,
  })
}

/**
 * This route is used to get the doc that the user has uploaded.
 * 
 * Will response the doc with the given id.
 * @param {string} id 
 * @returns {object}
{
  "review-id": "string",
  "filename": "string",
  "doc-id": "string",
  "creator": "string",
  "status": "draft"
}
 */
export function getFile(id) {
  return request({
    url: `/docs/${id}`,
    method: 'GET',
  })
}

/**
 * This route is used to update the doc with the given id.
 * 
 * Will update the doc with the given id.
 * @param {string} id 
 * @param {object} data 
{
  "newFile": "string" ($binary),
  "metadata": "object"
}
 * @returns 
 */
export function updateFile(id, data) {
  return request({
    url: `/docs/${id}`,
    method: 'PUT',
    data,
  })
}

/**
 * This route is used to delete the doc with the given id.
 * 
 * Will delete the doc with the given id.
 * @param {string} id 
 * @returns 
 */
export function deleteFile(id) {
  return request({
    url: `/docs/${id}`,
    method: 'DELETE',
  })
}

