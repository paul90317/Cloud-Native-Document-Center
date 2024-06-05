const request = require('supertest');
const app = require('../app');

describe('test review service', () => {
  var res;

  beforeAll(async () => {
  });

  afterAll(async () => {
  });

  it('show 401 when the request is not authorized', async () => {
    res = await request(app).get('/logs');
    expect(res.statusCode).toEqual(401);

    res = await request(app).post('/submit/1');
    expect(res.statusCode).toEqual(401);

    res = await request(app).delete('/submit/1');
    expect(res.statusCode).toEqual(401);

    res = await request(app).post('/review/1');
    expect(res.statusCode).toEqual(401);
  });
});

