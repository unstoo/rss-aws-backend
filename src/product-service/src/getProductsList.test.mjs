import { getProductsList } from "./getProductsList.mjs";
import { productsList } from "./products.mjs";

describe('getProductsList handler', function () {
  it('verifies successful response', async () => {
    const event = {};
    const result = await getProductsList(event)
    const parsedBody = JSON.parse(result.body);
    expect(result.statusCode).toEqual(200);
    expect(parsedBody.products[0]).toEqual(productsList[0]);
  });
});
