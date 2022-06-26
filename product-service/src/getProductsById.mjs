import { productsStore } from "./store.mjs";


export const getProductsById = async (event) => {
  const { productId } = event.pathParameters;
  try {
    const product = await productsStore.fetchById(productId);
    const statusCode = product ? 200 : 404;
    const body = product ? { product } : { message: 'Product not found' }
    return {
      statusCode,
      body: JSON.stringify(body, null, 2),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          statusCode: 500,
          message: String(e)
        },
        null,
        2
      ),
    };
  }
};
