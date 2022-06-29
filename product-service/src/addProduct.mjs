import { productsStore } from "./store.mjs";

export const addProduct = async (event) => {
  console.log({ addProduct: event.body });

  const { error, result } = parseParams(event.body);
  if (error) return { statusCode: error, body: 'Data is invalid' };

  const dbRes = await productsStore.addProduct(result);
  if (dbRes.error) return { statusCode: dbRes.error, body: dbRes.result };

  return {
    statusCode: 201,
    body: JSON.stringify({ product: dbRes.result }, null, 2),
  };
};

function parseParams(body) {
  const { error, result } = parseBody(body);
  if (error) return { error, result };

  const { title, description = '', price = 1, count = 1 } = result;

  if (!title) return { error: 'Title is required', result: null };
  if (!Number.isInteger(price) || price < 1) return { error: 'Incorrect price format', result: null };
  if (!Number.isInteger(count) || count < 1) return { error: 'Incorrect count format', result: null };

  return {
    error: null,
    result: {
      title, description, price, count,
    },
  };
};

function parseBody(body) {
  try {
    return { error: null, result: JSON.parse(body) };
  } catch (e) {
    return { error: 400, result: String(e) };
  }
};
