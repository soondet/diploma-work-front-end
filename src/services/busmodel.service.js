import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/busmodel/";

class BusModelService {
  getBusModels() {
    return axios.get(API_URL + "get");
  }
}

export default new BusModelService();
