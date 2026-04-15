import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

class AuthService {
  async login(username, password) {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    const { token, roles } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("roles", JSON.stringify(roles));
    this._setAxiosHeader(token);
    return response.data;
  }

  async register(username, password) {
    return axios.post(`${API_URL}/register`, { username, password });
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    localStorage.removeItem("panierId");
    delete axios.defaults.headers.common["Authorization"];
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getUsername() {
    return localStorage.getItem("username");
  }

  getRoles() {
    try {
      return JSON.parse(localStorage.getItem("roles")) || [];
    } catch {
      return [];
    }
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  hasRole(role) {
    return this.getRoles().includes(role);
  }

  isAdmin() {
    const roles = this.getRoles();
    return roles.includes("ADMIN") || roles.includes("SUPER_ADMIN");
  }

  isSuperAdmin() {
    return this.getRoles().includes("SUPER_ADMIN");
  }

  // Restore axios header on page reload
  initAxios() {
    const token = this.getToken();
    if (token) {
      this._setAxiosHeader(token);
    }
  }

  _setAxiosHeader(token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

const authService = new AuthService();
authService.initAxios();

export default authService;
