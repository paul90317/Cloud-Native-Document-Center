import { faker } from '@faker-js/faker/locale/zh_TW';
import { http } from 'msw';

const authHandlers = [
  // localLogin(data: object)
  http.post('/local/login', (req, res, ctx) => {
    console.log(req.body)
    return res(
      ctx.cookie('token', faker.random.alphaNumeric(64))
    )
  }),
  // localLogout()
  http.post('/local/logout', (req, res, ctx) => {
    return res(
      ctx.cookie('token', '', { maxAge: 0 })
    )
  }),
  // logalRegister(data: object)
  http.post('/local/register', (req, res, ctx) => {
    console.log(req.body)
    return res(
      ctx.status(200)
    )
  }),
  // getInfo()
  http.get('/info', (req, res, ctx) => {
    return res(
      ctx.json(
        {
          account: faker.internet.userName(),
          email: faker.internet.email(),
          name: faker.name.findName(),
          phone: faker.phone.phoneNumber(),
          profile: faker.lorem.paragraph(),
          manager: faker.datatype.boolean()
        }
      )
    )
  }),
  // patchInfo(data: object)
  http.patch('/info', (req, res, ctx) => {
    console.log(req.body)
    return res(
      ctx.status(200)
    )
  }),
  // resetPassword(data: object)
  http.patch('/password', (req, res, ctx) => {
    console.log(req.body)
    return res(
      ctx.status(200)
    )
  }),
  // setManager(data: object)
  http.patch('/manager/:account', (req, res, ctx) => {
    console.log(req.params)
    console.log(req.body)
    return res(
      ctx.status(200)
    )
  }),
  // getAllUserInfo()
  http.get('/users', (req, res, ctx) => {
    return res(
      ctx.json(
        Array.from({ length: 10 }, () => ({
          account: faker.internet.userName(),
          email: faker.internet.email(),
          name: faker.name.findName(),
          phone: faker.phone.phoneNumber(),
          profile: faker.lorem.paragraph(),
          manager: faker.datatype.boolean()
        }))
      )
    )
  }),
]

export default authHandlers