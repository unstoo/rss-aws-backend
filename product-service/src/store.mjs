import pg from 'pg';

const { user, password, database, host, port } = process.env;
const { Pool } = pg;
const pool = new Pool({ user, password, database, host, port });

const fetchAll = async () => {
  const { error, client, release } = await getClient();
  if (error) return { error: 500, result: error };

  try {
    const query = 'select p.id, p.title, p.description, p.price, s.count from products as p inner join stocks as s on p.id = s.product_id;';
    const res = await client.query(query);
    return { error: null, result: res.rows };
  } catch (err) {
    return { error: 500, result: String(err) };
  } finally {
    release();
  }
};


const fetchById = async (id) => {
  const { error, client, release } = await getClient();
  if (error) return { error: 500, result: error };

  try {
    const query = {
      text: 'select p.id, p.title, p.description, p.price, s.count from products as p inner join stocks as s on p.id = s.product_id where product_id = $1;',
      values: [id],
    };
    const res = await client.query(query);
    return { error: null, result: res.rows[0] };
  } catch (err) {
    return { error: 404, result: err };
  } finally {
    release();
  }
};

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

export const productsStore = {
  fetchById,
  fetchAll,
  addProduct,
};
