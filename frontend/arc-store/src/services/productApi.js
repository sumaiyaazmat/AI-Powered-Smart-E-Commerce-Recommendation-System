import { apiRequest } from './api';

export async function getProducts() {
  return await apiRequest('/products/');
}

export async function getProductById(productId) {
  return await apiRequest(`/products/${productId}`);
}