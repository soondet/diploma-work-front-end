import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://195.2.67.225:8080/api/role/";

class RoleService {
  getRoles() {
    return axios.get(API_URL + `get`, { headers: authHeader() });
  }
}

export default new RoleService();
