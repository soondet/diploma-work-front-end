import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/city/";

class CityService {
  getCities() {
    return axios.get(API_URL + "get");
  }
}

export default new CityService();
