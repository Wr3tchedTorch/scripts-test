import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/produtos",
});

export const getAllProducts = async () => {
  const response = await api.get("/");
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createProduct = async (product) => {
  const response = await api.post("/", product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.put(`/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
