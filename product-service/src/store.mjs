import pg from 'pg';

const { user, password, database, host, port } = process.env;
const { Client } = pg;
const client = new Client({ user, password, database, host, port })

const fetchAll = async () => {
  try {
    await client.connect();
    console.log(`DB connected`);
  } catch (err) {
    console.error(`DB Connect Failed: ${JSON.stringify(err)} ${JSON.stringify({ user, password, database, host, port })}`);
    client.end();
    return err;
  }

  try {
    const query = 'select * from products left join stocks on products.id = stocks.product_id;';
    const res = await client.query(query);
    return res.rows.map(({ id, title, description, price, count }) => {

      return {
        id, title, description, price, count
      };
    });
  } catch (err) {
    console.error(`DB SELECT Failed: ${JSON.stringify(err)}`);
    return err;
  } finally {
    client.end();
  }
};


const fetchById = async (id) => {
  try {
    await client.connect();
    console.log(`DB connected`);
  } catch (err) {
    console.error(`DB Connect Failed: ${JSON.stringify(err)} ${JSON.stringify({ user, password, database, host, port })}`);
    client.end();
    return err;
  }

  try {
    const query = {
      text: 'select * from products left join stocks on products.id = stocks.product_id where product_id = $1;',
      values: [id],
    }
    const res = await client.query(query);

    return res.rows.map(({ id, title, description, price, count }) => {

      return {
        id, title, description, price, count
      };
    });
  } catch (err) {
    console.error(`DB SELECT Failed: ${JSON.stringify(err)}`);
    return err;
  } finally {
    client.end();
  }
};
const addProduct = async ({ title, description, price }) => {
  try {
    await client.connect();
    console.log(`DB connected`);
  } catch (err) {
    console.error(`DB Connect Failed: ${JSON.stringify(err)} ${JSON.stringify({ user, password, database, host, port })}`);
    client.end();
    return { error: String(err), result: null };
  }

  try {
    const query = {
      text: 'insert into products (title, description, price) values ($1, $2, $3) returning *',
      values: [title, description, price],
    }
    const res = await client.query(query);
    return {
      error: null,
      result: res.rows[0],
    };

  } catch (err) {
    console.error(`DB INSERT Failed: ${JSON.stringify(err)}`);
    return { error: String(err), result: null };
  } finally {
    client.end();
  }
};
export const productsStore = {
  fetchById,
  fetchAll,
  addProduct,
};
