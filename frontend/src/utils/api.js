import axios from 'axios';

const API_BASE_URL = 'http://localhost/darain/backend/api';
const UPLOADS_BASE_URL = 'http://localhost/darain/backend/uploads';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Header Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post('/login.php', credentials);
export const getProducts = () => api.get('/products.php');
export const getProductById = (id) => api.get(`/product.php?id=${id}`);
export const addProduct = (data) => api.post('/add_product.php', data);
export const updateProduct = (data) => api.post('/update_product.php', data);
export const deleteProduct = (id) => api.get(`/delete_product.php?id=${id}`);
export const uploadImage = (formData) => api.post('/upload_image.php', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const getEnquiries = () => api.get('/enquiries.php');
export const addEnquiry = (data) => api.post('/add_enquiry.php', data);
export const updateEnquiryStatus = (id, status) => api.post('/enquiries.php', { id, status });
export const deleteEnquiry = (id) => api.delete(`/enquiries.php?id=${id}`);

// Hero Slides
export const getHeroSlides = () => api.get('/hero_slides.php');
export const addHeroSlide = (data) => api.post('/add_hero_slide.php', data);
export const updateHeroSlide = (data) => api.post('/update_hero_slide.php', data);
export const deleteHeroSlide = (id) => api.get(`/delete_hero_slide.php?id=${id}`);

// Site Settings (Logo, Favicon)
export const getSettings = () => api.get('/settings.php');
export const updateSettings = (data) => api.post('/settings.php', data);

export { UPLOADS_BASE_URL };
export default api;
