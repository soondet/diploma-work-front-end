import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/sequence/";

class SequenceService {
  getSequenceAddressesByRouteId(routeId) {
    return axios.get(API_URL + `addresses?routeId=${routeId}`);
  }
}

export default new SequenceService();
