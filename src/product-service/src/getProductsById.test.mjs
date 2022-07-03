import { getProductsById } from "./getProductsById.mjs";
import { productsList } from "./products.mjs";

describe('getProductsById handler', function () {
  it('verifies successful response', async () => {
    const productId = 5;
    const event = {
      pathParameters: {
        productId,
      }
    }

    const result = await getProductsById(event)
    const parsedBody = JSON.parse(result.body);
    expect(result.statusCode).toEqual(200);
    expect(parsedBody.product).toEqual(productsList.find(item => item.productId === productId));
  });

  it('verifies "Not found" response', async () => {
    const invalidId = 'invalid-id';
    const event = {
      pathParameters: {
        productId: invalidId,
      }
    }

    const result = await getProductsById(event)
    const parsedBody = JSON.parse(result.body);
    expect(result.statusCode).toEqual(404);
    expect(parsedBody.message).toEqual('Product not found');
  });
});
