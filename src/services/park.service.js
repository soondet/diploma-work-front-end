import axios from "axios";
import authHeader from "./auth-header";

export const API_URL = "http://195.2.67.225:8080/api/park/";

class ParkService {
  getParksByCity(cityId) {
    return axios.get(API_URL + `getByCity?cityId=${cityId}`);
  }
  getParks() {
    return axios.get(API_URL + `get`);
  }
}

export default new ParkService();
