class Service {

  constructor(host = '') {
    this.host = host;
  }

  request(method, path, init) {
    let url = new URL(path, this.host)
    console.log('=========================================================')
    console.log(method, url.href)
    console.log(init)

    init.method = method
    if (init.body && typeof init.body === 'object') {
      if (!init.headers)
        init.headers = {
          'Content-Type': 'application/json'
        };
      else
        init.headers['Content-Type'] = 'application/json'
      init.body = JSON.stringify(init.body);
    }
    return new Promise((resolve, reject) => {
      fetch(url.href, init)
        .then(res => {
          console.log(res.status, res.statusText)
          resolve(res)
        })
    })
  }

  get(path, init = {}) {
    return this.request('GET', path, init);
  }

  post(path, init = {}) {
    return this.request('POST', path, init);
  }

  delete(path, init = {}) {
    return this.request('DELETE', path, init);
  }

  put(path, init = {}) {
    return this.request('PUT', path, init);
  }

  patch(path, init = {}) {
    return this.request('PATCH', path, init);
  }
}

const { sql_query } = require('./utils/mysql')

let auth_svc = new Service('http://auth')

var paul90317 = ''
var admin = ''

sql_query('delete from roles')
  .then(async result => {
    await sql_query('delete from logs')
    await sql_query('delete from roles')
    await sql_query('delete from documents')
    return sql_query('delete from users')
  })
  .then(result => {
    return sql_query('insert into users (account, passwd, manager) values (?, ?, ?)', ['admin', 'admin', true])
  })
  .then(result => {
    console.log('paul90317:')
    return auth_svc.post('local/login', {
      body: {
        account: 'paul90317',
        passwd: '123456'
      }
    })
  })
  .then(res => {
    console.log('paul90317:')
    return auth_svc.post('local/register', {
      body: {
        account: 'paul90317',
        passwd: '123456'
      }
    })
  })
  .then(res => {
    console.log('paul90317:')
    return auth_svc.post('local/login', {
      body: {
        account: 'paul90317',
        passwd: '123456'
      }
    })
  })
  .then(res => {
    paul90317 = res.headers.get('authorization')
    console.log('paul90317:')
    return auth_svc.get('users', {
      headers: {
        'authorization': paul90317
      }
    })
  })
  .then(res => {
    return res.json()
  })
  .then(data => {
    console.log(data)
    console.log('paul90317:')
    return auth_svc.patch('info', {
      headers: {
        authorization: paul90317
      },
      body: {
        name: 'Paul Wu',
        profile: 'haha'
      }
    })
  })
  .then(res => {
    console.log('paul90317:')
    return auth_svc.put('passwd', {
      headers: {
        authorization: paul90317,
      },
      body: {
        passwd: 'asd123456'
      }
    })
  })
  .then(res => {
    console.log('admin:')
    return auth_svc.post('local/login', {
      body: {
        account: 'admin',
        passwd: 'admin'
      }
    })
  })
  .then(res => {
    admin = res.headers.get('authorization');
    console.log('paul90317:')
    return auth_svc.put('manager/paul90317', {
      headers: {
        authorization: paul90317
      }
    })
  })
  .then(res => {
    console.log('admin:')
    return auth_svc.put('manager/paul90317', {
      headers: {
        authorization: admin
      }
    })
  })
  .then(res => {
    console.log('paul90317:')
    return auth_svc.get('info', {
      headers: {
        authorization: paul90317
      }
    })
  })
  .then(res => {
    return res.json()
  })
  .then(data => {
    console.log(data)
  })