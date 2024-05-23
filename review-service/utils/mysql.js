const fs = require('fs');
const mysql = require('mysql2');

const db_config = {
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'doc_center'
};

function sql_query(sql, paras = [], conn = undefined) {
  return new Promise((resolve, reject) => {
    try {
      if (!conn)
        conn = mysql.createConnection(db_config);
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

function sql_file(sql_fn, paras = []) {
  return new Promise(async (resolve, reject) => {
    try {
      const conn = mysql.createConnection(db_config);
      let sql = fs.readFileSync(sql_fn, 'utf-8')
      let sqls = sql.split(';')
      let transactions = []
      for (var s of sqls)
        if (s.trim().length > 0)
          transactions.push(s)

      let result = null
      for (let t of transactions)
        result = await sql_query(t, paras, conn)
      resolve(result)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { sql_query, sql_file }