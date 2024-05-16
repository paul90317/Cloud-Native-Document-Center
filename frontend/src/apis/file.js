import request from '@/utils/request'

export function uploadImage(data) {
  return request({
    url: '/upload/image',
    method: 'post',
    data
  })
}
