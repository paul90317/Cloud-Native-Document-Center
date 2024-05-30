class Service {

  constructor(host = '') {
    this.host = host;
  }

  request(method, path, init) {
    let url = new URL(path, this.host)
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

function start(name) {
  console.log('=========================================================')
  console.log(`${name}:`)
}

const { sql_query } = require('./utils/mysql')

let auth_svc = new Service('http://auth')
let review_svc = new Service('http://review-service')

var paul90317 = ''
var admin = ''
setTimeout(async () => {
  await sql_query('delete from logs')
  await sql_query('delete from roles')
  await sql_query('delete from documents')
  await sql_query('delete from users')
  await sql_query('insert into users (account, passwd, manager) values (?, ?, ?)', ['paul90317', '123456', false])
  await sql_query('insert into users (account, passwd, manager) values (?, ?, ?)', ['admin', 'admin', true])
  await sql_query('insert into users (account, passwd, manager) values (?, ?, ?)', ['reviewer0', '123456', false])
  await sql_query('insert into users (account, passwd, manager) values (?, ?, ?)', ['another', '123456', false])
  await sql_query('insert documents (id, name, creator, reviewer, content) values (?, ?, ?, ?, ?)', [1, 'hello_world', 'paul90317', 'paul90317', 'content'])

  let paul90317 = (await auth_svc.post('local/login', {
    body: {
      account: 'paul90317',
      passwd: '123456'
    }
  })).headers.get('authorization').replace('Bearer', 'paul90317')

  let admin = (await auth_svc.post('local/login', {
    body: {
      account: 'admin',
      passwd: 'admin'
    }
  })).headers.get('authorization').replace('Bearer', 'admin')

  let reviewer0 = (await auth_svc.post('local/login', {
    body: {
      account: 'reviewer0',
      passwd: '123456'
    }
  })).headers.get('authorization').replace('Bearer', 'reviewer0')

  let another = (await auth_svc.post('local/login', {
    body: {
      account: 'another',
      passwd: '123456'
    }
  })).headers.get('authorization').replace('Bearer', 'another')

  await review_svc.post('submit/1', {
    headers: {
      authorization: paul90317
    },
    body: {
      reviewer: 'paul90317',
      message: 'initial submit'
    }
  })

  await review_svc.post('submit/1', {
    headers: {
      authorization: paul90317
    },
    body: {
      reviewer: 'reviewer0',
      message: 'initial submit'
    }
  })

  await review_svc.delete('submit/1', {
    headers: {
      authorization: reviewer0
    }
  })

  await review_svc.delete('submit/1', {
    headers: {
      authorization: admin
    }
  })

  await review_svc.post('submit/1', {
    headers: {
      authorization: paul90317
    },
    body: {
      reviewer: 'reviewer0',
      message: 'initial submit'
    }
  })

  await review_svc.delete('submit/1', {
    headers: {
      authorization: paul90317
    }
  })

  await review_svc.post('submit/1', {
    headers: {
      authorization: admin
    },
    body: {
      reviewer: 'reviewer0',
      message: 'initial submit'
    }
  })

  let res = await review_svc.get('reviewer/reviewer0/docs', {
    headers: {
      authorization: paul90317
    }
  })

  res = await review_svc.get('reviewer/reviewer0/docs', {
    headers: {
      authorization: another
    }
  })

  res = await review_svc.get('reviewer/reviewer0/docs', {
    headers: {
      authorization: reviewer0
    }
  })
  console.log(await res.json())

  res = await review_svc.get('reviewer/reviewer0/docs', {
    headers: {
      authorization: admin
    }
  })
  console.log(await res.json())

  res = await review_svc.get('doc/1', {
    headers: {
      authorization: another
    }
  })

  res = await review_svc.get('doc/1', {
    headers: {
      authorization: paul90317
    }
  })
  console.log(await res.json())

  res = await review_svc.get('doc/1', {
    headers: {
      authorization: reviewer0
    }
  })
  console.log(await res.json())

  res = await review_svc.get('doc/1', {
    headers: {
      authorization: admin
    }
  })
  console.log(await res.json())

  await review_svc.post('review/1', {
    headers: {
      authorization: admin
    },
    body: {
      status: 2,
      message: 'NO!'
    }
  })

  await review_svc.post('review/1', {
    headers: {
      authorization: reviewer0
    },
    body: {
      status: 2,
      message: 'NO!'
    }
  })

  await review_svc.post('review/1', {
    headers: {
      authorization: reviewer0
    },
    body: {
      status: 3
    }
  })

  await review_svc.delete('submit/1', {
    headers: {
      authorization: admin
    }
  })

  await review_svc.post('submit/1', {
    headers: {
      authorization: admin
    },
    body: {
      reviewer: 'reviewer0',
      message: 'initial submit'
    }
  })

  await review_svc.post('review/1', {
    headers: {
      authorization: reviewer0
    },
    body: {
      status: 3,
      message: 'OK!'
    }
  })

  await review_svc.post('review/1', {
    headers: {
      authorization: reviewer0
    },
    body: {
      status: 3
    }
  })

  res = await review_svc.get('logs', {
    headers: {
      authorization: admin
    }
  })
  console.log(await res.json())

  res = await review_svc.get('logs', {
    headers: {
      authorization: another
    }
  })
  console.log(await res.json())

  res = await review_svc.get('logs', {
    headers: {
      authorization: paul90317
    }
  })
  console.log(await res.json())

  res = await review_svc.get('logs', {
    headers: {
      authorization: reviewer0
    }
  })
  console.log(await res.json())

  res = await review_svc.get('logs?user=reviewer0', {
    headers: {
      authorization: paul90317
    }
  })
  console.log(await res.json())

  res = await review_svc.get('logs?user=paul90317', {
    headers: {
      authorization: paul90317
    }
  })
  console.log(await res.json())

  res = await review_svc.get('logs?user=admin', {
    headers: {
      authorization: paul90317
    }
  })
  console.log(await res.json())

  res = await review_svc.get('logs?document=2', {
    headers: {
      authorization: paul90317
    }
  })

  res = await review_svc.get('logs?document=xxx', {
    headers: {
      authorization: paul90317
    }
  })

  res = await review_svc.get('logs?document=1', {
    headers: {
      authorization: paul90317
    }
  })
  console.log(await res.json())
}, 0)
