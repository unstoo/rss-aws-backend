import { productsList } from "./products.mjs";

const fetchAll = async () => new Promise((resolve, reject) => {
  setTimeout(() => resolve(productsList), 500);
});

const fetchById = async (id) => new Promise((resolve, reject) => {
  const product = productsList.find(item => String(item.productId) === id);
  setTimeout(() => resolve(product), 1500);
});

export const productsStore = {
  fetchById,
  fetchAll,
};
