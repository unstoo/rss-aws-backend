import { productsStore } from "./store.mjs";

export const getProductsList = async () => {
  console.log({ getProductsList: '' });
  const { error, result } = await productsStore.fetchAll();

  if (error) return { statusCode: error, body: result };

  return {
    statusCode: 200,
    body: JSON.stringify({ products: result }, null, 2),
  };
};
