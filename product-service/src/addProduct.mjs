import { productsStore } from "./store.mjs";

export const addProduct = async (event) => {
  const { error, params } = parseParams(event.body);
  if (error) return makeResponse(400, params);

  const dbRes = await productsStore.addProduct(params);
  if (dbRes.error) return makeResponse(500, 'Server error');

  return makeResponse(200, { product: dbRes.result })
};

function parseBody(body) {
  try {
    return { error: null, body: JSON.parse(body) }
  } catch (e) {
    return { error: String(e), body: null };
  }
};

function parseParams(body) {
  const result = parseBody(body);
  if (result.error) return result;

  const { title, description = '', price = 0 } = result.body;

  if (!title) return { error: 'Title is required', params: null };
  return {
    error: null, params: {
      title, description, price,
    },
  };
}

function makeResponse(statusCode, body) {
  return {
    statusCode,
    body: JSON.stringify(body, null, 2),
  };
};