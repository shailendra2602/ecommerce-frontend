
const API_URL = "http://localhost:5000/api/products";

export const getProducts = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return data.products;
};
