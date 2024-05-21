import { fakerZH_TW as faker } from '@faker-js/faker';
import { http, HttpResponse } from 'msw';
import { api } from '../apiUrl';

const authHandlers = [
  // localLogin(data: object)
  http.post(api('/local/login'), ({ params, request, cookies }) => {
    console.log('body:', request.body)
    return new HttpResponse(null, {
      headers: {
        'Set-Cookie': 'token=abc-123; Max-age=86400',
      },
    })
  }),
  // localLogout()
  http.post(api('/local/logout'), ({ params, request, cookies }) => {
    return new HttpResponse(null, {
      headers: {
        'Set-Cookie': 'token=; Max-Age=0;',
      },
    })
  }),
  // logalRegister(data: object)
  http.post(api('/local/register'), ({ params, request, cookies }) => {
    console.log('body:', request.body)
    return HttpResponse.status(200)
  }),
  // getInfo()
  http.get(api('/info'), ({ params, request, cookies }) => {
    return HttpResponse.json(
      {
        account: faker.internet.userName(),
        email: faker.internet.email(),
        name: faker.internet.userName(),
        phone: faker.phone.number(),
        profile: faker.lorem.paragraph(),
        manager: faker.datatype.boolean()
      }
    )
  }),
  // patchInfo(data: object)
  http.patch(api('/info'), ({ params, request, cookies }) => {
    console.log('body:', request.body)
    return HttpResponse.status(200)
  }),
  // resetPassword(data: object)
  http.patch(api('/password'), ({ params, request, cookies }) => {
    console.log('body:', request.body)
    return HttpResponse.status(200)
  }),
  // setManager(data: object)
  http.patch(api('/manager/:account'), ({ params, request, cookies }) => {
    console.log('body:', request.body)
    console.log('account:', params.account)
    return HttpResponse.status(200)
  }),
  // getAllUserInfo()
  http.get(api('/users'), ({ params, request, cookies }) => {
    return HttpResponse.json(
      Array.from({ length: 10 }, () => ({
        account: faker.internet.userName(),
        email: faker.internet.email(),
        name: faker.internet.userName(),
        phone: faker.phone.number(),
        profile: faker.lorem.paragraph(),
        manager: faker.datatype.boolean()
      }))
    )
  }),
]

export default authHandlers