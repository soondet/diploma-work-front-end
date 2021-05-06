import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/role/";

class RoleService {
  getRoles() {
    return axios.get(API_URL + `get`, { headers: authHeader() });
  }
}

export default new RoleService();
