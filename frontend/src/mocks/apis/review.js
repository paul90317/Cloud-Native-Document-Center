import { ROLE_STATUS } from '@/enum/roles';
import { faker } from '@faker-js/faker/locale/zh_TW';
import { http } from 'msw';

const reviewHandlers = [
  // getAccountReviewList(account: string)
  http.get('/reviewer/:account/files', (req, res, ctx) => {
    return res(
      ctx.json(
        Array.from({ length: 5 }).map(() => ({
          user: faker.internet.userName(),
          document: faker.random.number(),
          status: faker.helpers.enumValue(ROLE_STATUS),
        }))
      )
    )
  }),
  // getFileReviewer(file_id: int)
  http.get('/file/:file_id/reviewer', (req, res, ctx) => {
    return res(
      ctx.json({
        reviewer: faker.internet.userName(),
        status: faker.helpers.enumValue(ROLE_STATUS),
        message: faker.lorem.sentence(),
      })
    )
  }),
  // overrideFileReviewer(file_id: int, account: string, data: object)
  http.post('/file/:file_id/reviewer/:account', (req, res, ctx) => {
    return res(ctx.status(204))
  }),
  // deleteFileReviewer(file_id: int, account: string)
  http.delete('/file/:file_id/reviewer/:account', (req, res, ctx) => {
    return res(ctx.status(204))
  }),
  // reviewFile(file_id: int, data: object)
  http.post('/file/:file_id/review', (req, res, ctx) => {
    return res(ctx.status(204))
  }),
]

export default reviewHandlers