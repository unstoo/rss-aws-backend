import pg from 'pg';

const { user, password, database, host, port } = process.env;
const { Pool } = pg;
const pool = new Pool({ user, password, database, host, port });

const fetchAll = async () => {
  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    client.release();
    return { error: String(err), result: null };
  }

  try {
    const query = 'select * from products left join stocks on products.id = stocks.product_id;';
    const res = await client.query(query);
    const result = res.rows.map(({ id, title, description, price, count }) => {
      return {
        id, title, description, price, count
      };
    });
    return { error: null, result };
  } catch (err) {
    console.error(`DB SELECT Failed: ${JSON.stringify(err)}`);
    return { error: String(err), result: null };
  } finally {
    client.release();
  }
};


const fetchById = async (id) => {
  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    client.release();
    return { error: String(err), result: null };
  }

  try {
    const query = {
      text: 'select * from products left join stocks on products.id = stocks.product_id where product_id = $1;',
      values: [id],
    };
    const res = await client.query(query);

    return { error: null, result: res.rows[0] };

  } catch (err) {
    return { error: 404, result: null };
  } finally {
    client.release();
  }
};

const addProduct = async ({ title, description, price }) => {
  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    client.release();
    return { error: String(err), result: null };
  }
  try {
    await client.query('BEGIN');

    const insertProductQuery = {
      text: 'insert into products (title, description, price) values ($1, $2, $3) returning *',
      values: [title, description, price],
    };
    const res = await client.query(insertProductQuery);


    const insertStocksQuery = {
      text: 'INSERT INTO stocks(product_id, count) VALUES ($1, $2)',
      values: [res.rows[0].id, 33],
    };
    await client.query(insertStocksQuery)
    await client.query('COMMIT')
    return {
      error: null,
      result: res.rows[0],
    };
  } catch (e) {
    await client.query('ROLLBACK')
    return {
      error: String(e),
      result: null,
    };
  } finally {
    client.release();
  }
};

export const productsStore = {
  fetchById,
  fetchAll,
  addProduct,
};
