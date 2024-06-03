const fs = require('fs');
const mysql = require('mysql2/promise');
const { Connector } = require('@google-cloud/cloud-sql-connector');

let pool, connector;

async function initializePool() {
  connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.CLOUD_SQL_INSTANCE_CONNECTION_NAME,
    ipType: 'PUBLIC',
  });

  pool = await mysql.createPool({
    ...clientOpts,
    user: process.env.CLOUD_SQL_USER,
    password: process.env.CLOUD_SQL_PASSWORD,
    database: process.env.CLOUD_SQL_DATABASE_NAME,
  });
}

async function sql_query(sql, paras = [], conn = undefined) {
  if (!pool) {
    await initializePool();
  }
  if (!conn) {
    conn = await pool.getConnection();
  }
  try {
    const [result] = await conn.execute(sql, paras);
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

async function sql_file(sql_fn, paras = []) {
  if (!pool) {
    await initializePool();
  }
  const conn = await pool.getConnection();
  try {
    const sql = fs.readFileSync(sql_fn, 'utf-8');
    const sqls = sql.split(';').filter(s => s.trim().length > 0);

    let result = null;
    for (let t of sqls) {
      result = await sql_query(t, paras, conn);
    }
    return result;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

async function closeConnection() {
  await pool.end();
  connector.close();
}

module.exports = { sql_query, sql_file, closeConnection };
