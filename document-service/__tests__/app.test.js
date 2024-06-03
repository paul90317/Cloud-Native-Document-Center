const request = require('supertest');
const app = require('../app');

describe('api router test', () => {
  it('GET /users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('respond with a resource');
  });
});
