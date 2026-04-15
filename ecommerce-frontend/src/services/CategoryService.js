import axios from "axios";

const API_URL = "http://localhost:8080/api/categories";

class CategoryService {
  getAllCategories() {
    return axios.get(API_URL);
  }

  getCategoryById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  createCategory(category) {
    return axios.post(API_URL, category);
  }

  updateCategory(id, category) {
    return axios.put(`${API_URL}/${id}`, category);
  }

  deleteCategory(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

const categoryService = new CategoryService();

export default categoryService;