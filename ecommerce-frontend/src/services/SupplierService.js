import axios from "axios";

const API_URL = "http://localhost:8080/api/suppliers";

class SupplierService {
  getAllSuppliers() {
    return axios.get(API_URL);
  }

  getSupplierById(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  createSupplier(supplier) {
    return axios.post(API_URL, supplier);
  }

  updateSupplier(id, supplier) {
    return axios.put(`${API_URL}/${id}`, supplier);
  }

  deleteSupplier(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

const supplierService = new SupplierService();

export default supplierService;