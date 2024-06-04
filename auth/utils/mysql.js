const fs = require('fs');
const mysql = require('mysql2');

var db_config = {
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'doc_center'
};

function sql_load(_db_config) {
  db_config = _db_config
}

function _sql_query(conn, sql, paras = []) {
  return new Promise((resolve, reject) => {
    try {
      conn.execute(sql, paras, (err, result) => {
        if (err)
          reject(err);
        else
          resolve(result);
      })
    } catch (err) {
      reject(err)
    }
  })
}

function sql_query(sql, paras = []) {
  return new Promise(async (resolve, reject) => {
    try {
      var conn = mysql.createConnection(db_config);
      const res = _sql_query(conn, sql, paras);
      resolve(res);
    } catch (err) {
      reject(err);
    } finally {
      conn.end(err => {

      });
    }
  })

}

function sql_file(sql_fn, paras = []) {
  return new Promise(async (resolve, reject) => {
    try {
      var conn = mysql.createConnection(db_config);
      let sql = fs.readFileSync(sql_fn, 'utf-8')
      let sqls = sql.split(';')
      let transactions = []
      for (var s of sqls)
        if (s.trim().length > 0)
          transactions.push(s)

      let result = null
      for (let t of transactions)
        result = await _sql_query(conn, t, paras)
      resolve(result)
    } catch (err) {
      reject(err)
    } finally {
      conn.end(err => {

      });
    }
  })
}

module.exports = { sql_query, sql_file, sql_load }