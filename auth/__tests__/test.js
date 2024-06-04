const request = require('supertest');
const app = require('../app');
const { sql_load, sql_query, sql_file } = require('../utils/mysql');
const { MySqlContainer } = require('@testcontainers/mysql');

describe('test auth service', () => {
  var mysql_container;
  var res;
  var normal_user;
  var admin_user;

  beforeAll(async () => {
    mysql_container = await new MySqlContainer().start();
    sql_load(mysql_container.getConnectionUri());
    await sql_file(__dirname + '/init.sql');
  }, 9999999);

  afterAll(async () => {
    await mysql_container.stop();
  });

  it('login user not found', async () => {
    res = await request(app).post('/local/login').send({
      account: 'paul90317',
      passwd: 'asd123456'
    });
    expect(res.statusCode).toEqual(401);
  });

  it('register and login', async () => {
    res = await request(app).post('/local/register').send({
      account: 'paul90317',
      passwd: 'asd123456',
      email: 'paul2309825@gmail.com',
      name: 'Paul Wu',
      phone: '123456',
      profile: 'Hello'
    });
    expect(res.statusCode).toEqual(200);

    res = await request(app).post('/local/login').send({
      account: 'paul90317',
      passwd: 'asd123456'
    });
    expect(res.statusCode).toEqual(200);

    normal_user = res.get('Authorization');
  });

  it('get /auth', async () => {
    res = await request(app).get('/auth');
    expect(res.statusCode).toEqual(401);

    res = await request(app).get('/auth').set('Authorization', normal_user);
    expect(res.statusCode).toEqual(200);
  })

  it('duplicated register', async () => {
    res = await request(app).post('/local/register').send({
      account: 'paul90317',
      passwd: 'asd123456',
      email: 'paul90317@gmail.com',
      name: 'Paul Wu',
      phone: '123456',
      profile: 'Hello'
    });
    expect(res.statusCode).toEqual(409);
  });

  it('get /info', async () => {
    res = await request(app).get('/info')
    expect(res.status).toEqual(401);

    res = await request(app).get('/info').set('Authorization', normal_user);
    expect(res.body.name).toEqual('Paul Wu');
    expect(res.body.profile).toEqual('Hello');
  });

  it('patch /info', async () => {
    res = await request(app).patch('/info').send({
      name: 'Jason',
      profile: 'Hi'
    }).set('Authorization', normal_user);
    expect(res.statusCode).toEqual(200);

    res = await request(app).get('/info').set('Authorization', normal_user);
    expect(res.body.name).toEqual('Jason');
    expect(res.body.profile).toEqual('Hi');
  });

  it('test manager', async () => {
    res = await request(app).put('/manager/paul90317').set('Authorization', normal_user);
    expect(res.statusCode).toEqual(403);

    await sql_query('insert into users (account, passwd, manager) values (?, ?, ?)', ['admin', 'admin', true]);
    res = await request(app).post('/local/login').send({
      account: 'admin',
      passwd: 'admin'
    })
    admin_user = res.get('Authorization');

    res = await request(app).put('/manager/paul90317').set('Authorization', admin_user);
    expect(res.statusCode).toEqual(200);

    res = await request(app).get('/info').set('Authorization', normal_user);
    expect(res.body.manager).toEqual(1);
  });
});

