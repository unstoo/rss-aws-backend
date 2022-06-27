import { productsStore } from "./store.mjs";

export const addProduct = async (event) => {
  console.log({ addProduct: event.body });

  const { error, params } = parseParams(event.body);
  if (error) return { statusCode: 400, body: error };

  const dbRes = await productsStore.addProduct(params);
  if (dbRes.error) return { statusCode: 500, body: dbRes.error };

  return {
    statusCode: 200,
    body: JSON.stringify({ product: dbRes.result }, null, 2),
  };
};

function parseParams(body) {
  const result = parseBody(body);
  if (result.error) return result;

  const { title, description = '', price = 0, count = 1 } = result.body;

  if (!title) return { error: 'Title is required', params: null };
  if (!Number.isInteger(price)) return { error: 'Incorrect price format', params: null };

  return {
    error: null,
    params: {
      title, description, price, count,
    },
  };
}

function parseBody(body) {
  try {
    return { error: null, body: JSON.parse(body) }
  } catch (e) {
    return { error: String(e), body: null };
  }
};