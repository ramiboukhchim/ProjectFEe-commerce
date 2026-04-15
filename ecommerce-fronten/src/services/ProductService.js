import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

class ProductService {
  getAllProducts() {
    return axios.get(API_URL);
  }

  getAllProductsAdmin() {
    return axios.get(`${API_URL}/admin`);
  }

  getProductById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  createProduct(product) {
    return axios.post(API_URL, product);
  }

  updateProduct(id, product) {
    return axios.put(`${API_URL}/${id}`, product);
  }

  toggleProductActive(id, active) {
    return axios.patch(`${API_URL}/${id}/active?value=${active}`);
  }

  deleteProduct(id) {
    return axios.delete(`${API_URL}/${id}`);
  }

  // Upload image
  uploadImage(formData) {
    return axios.post(`${API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }

  getCategories() {
    return axios.get("http://localhost:8080/api/categories");
  }

  getSuppliers() {
    return axios.get("http://localhost:8080/api/suppliers");
  }
}

const productService = new ProductService();

export default productService;