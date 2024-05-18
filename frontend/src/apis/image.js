import request from '@/utils/request/image'

/**
 * Get ids of all images uploaded by the user.
 * @returns {object}
{
  "ids": [
    "string"
  ]
}
 */
export function getAllImages() {
  return request({
    url: '/image/ids',
    method: 'GET',
  })
}

/**
 * This route is used to download the image that the user has uploaded.
 * 
 * Will download the image with the given id.
 * @param {string} id 
 * @returns {image}
 */
export function getImage(id) {
  return request({
    url: `/image/${id}`,
    method: 'GET',
  })
}

/**
 * This route is used to upload an image.
 * 
 * Will upload the image file.
 * @param {object} data 
{
  "file": "string" ($binary)
}
 * @returns {object}
{
  "id": "string"
}
 */
export function uploadImage(data) {
  return request({
    url: '/image',
    method: 'POST',
    data,
  })
}