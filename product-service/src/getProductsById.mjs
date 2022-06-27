import { productsStore } from "./store.mjs";


export const getProductsById = async (event) => {
  const { productId } = event.pathParameters;
  console.log({ productId: productId });

  const { error, result } = await productsStore.fetchById(productId);

  if (result && result.id)
    return {
      statusCode: 200,
      body: JSON.stringify({ product: result }, null, 2),
    };

  if (error === 404)
    return {
      statusCode: 404,
      body: 'Product not found',
    };

  return {
    statusCode: 500,
    body: error,
  };

};
