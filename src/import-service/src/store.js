const pg = require('pg');

const { user, password, database, host, port } = process.env;
const { Pool } = pg;
const pool = new Pool({ user, password, database, host, port });

const addProduct = async ({ title, description, price, count }) => {
  const { error, client, release } = await getClient();
  if (error) return { error: 500, result: error };

  try {
    await client.query('BEGIN');
    const insertProductQuery = {
      text: 'insert into products (title, description, price) values ($1, $2, $3) returning id',
      values: [title, description, price],
    };
    const res = await client.query(insertProductQuery);
    const insertStocksQuery = {
      text: 'INSERT INTO stocks(product_id, count) VALUES ($1, $2)',
      values: [res.rows[0].id, count],
    };
    await client.query(insertStocksQuery)
    await client.query('COMMIT')
    return { error: null, result: res.rows[0] };
  } catch (e) {
    await client.query('ROLLBACK')
    return { error: 500, result: String(e) };
  } finally {
    release();
  }
};

async function getClient() {
  let client;
  try {
    client = await pool.connect();
    return { error: null, client, release: client.release };
  } catch (err) {
    client.release();
    return { error: String(err), client: null, release: null };
  }
};

module.exports = { addProduct };
