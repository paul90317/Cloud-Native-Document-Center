import { ROLE_STATUS } from '@/enum/roles';
import { fakerZH_TW as faker } from '@faker-js/faker';
import { HttpResponse, http } from 'msw';
import { api } from '../apiUrl';

const reviewHandlers = [
  // getAccountReviewList(account: string)
  http.get(api('/reviewer/:account/files'), ({ params, request, cookies }) => {
    console.log('account', params.account)
    return HttpResponse.json(
      Array.from({ length: 5 }).map(() => ({
        user: faker.internet.userName(),
        document: faker.random.number(),
        status: faker.helpers.enumValue(ROLE_STATUS),
      }))
    )
  }),
  // getFileReviewer(file_id: int)
  http.get(api('/file/:file_id/reviewer'), () => {
    return HttpResponse.json({
      reviewer: faker.internet.userName(),
      status: faker.helpers.enumValue(ROLE_STATUS),
      message: faker.lorem.sentence(),
    })
  }),
  // overrideFileReviewer(file_id: int, account: string, data: object)
  http.post(api('/file/:file_id/reviewer/:account'), () => {
    return HttpResponse.status(204)
  }),
  // deleteFileReviewer(file_id: int, account: string)
  http.delete(api('/file/:file_id/reviewer/:account'), () => {
    return HttpResponse.status(204)
  }),
  // reviewFile(file_id: int, data: object)
  http.post(api('/file/:file_id/review'), () => {
    return HttpResponse.status(204)
  }),
]

export default reviewHandlers