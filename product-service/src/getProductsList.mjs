import { productsStore } from "./store.mjs";

export const getProductsList = async (event) => {
  console.log({ getProductsList: '' });
  const products = await productsStore.fetchAll();
  const productsAreValid = Array.isArray(products);
  const statusCode = productsAreValid ? 200 : 500;
  const body = productsAreValid ? { products } : { message: 'Bad server response' }
  return {
    statusCode,
    body: JSON.stringify(body, null, 2),
  };
};