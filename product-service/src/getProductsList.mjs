import { productsStore } from "./store.mjs";

export const getProductsList = async () => {
  console.log({ getProductsList: '' });
  const { error, result } = await productsStore.fetchAll();

  if (error) return { statusCode: 500, body: error };

  return {
    statusCode: 200,
    body: JSON.stringify({ products: result }, null, 2),
  };
};