import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Configurer axios pour les cookies de session
axios.defaults.withCredentials = true;

class CartService {
  addProductToCart(panierId, productId, qty) {
    const params = { productId, qty };
    if (panierId !== null && panierId !== undefined && panierId !== '') {
      params.panierId = panierId;
    }
    return axios.post(`${API_BASE_URL}/paniers/addProduct`, null, { params });
  }

  getCart(panierId) {
    if (panierId !== null && panierId !== undefined && panierId !== '') {
      return axios.get(`${API_BASE_URL}/paniers/${panierId}`);
    }
    return axios.get(`${API_BASE_URL}/paniers/current`);
  }

  removeLineFromCart(panierId, ligneId) {
    if (panierId !== null && panierId !== undefined && panierId !== '') {
      return axios.delete(`${API_BASE_URL}/paniers/${panierId}/remove/${ligneId}`);
    }
    return axios.delete(`${API_BASE_URL}/paniers/remove/${ligneId}`);
  }

  createOrderFromCart(panierId) {
    const url = panierId !== null && panierId !== undefined && panierId !== ''
      ? `${API_BASE_URL}/commande/from-panier/${panierId}`
      : `${API_BASE_URL}/commande/from-panier`;
    return axios.post(url);
  }
}

const cartService = new CartService();

export default cartService;