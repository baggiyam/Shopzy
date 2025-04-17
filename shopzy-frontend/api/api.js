import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5004/api' });

export const getAllProducts = () => API.get('/products');
export const getFeaturedProducts = () => API.get('/products?isFeatured=true');
export const getByCategory = (category) => API.get(`/category?category=${category}`);
