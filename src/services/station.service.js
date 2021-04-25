import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/station/";

class StationService {
  getStationCities() {
    return axios.get(API_URL + "cities");
  }
  
}

export default new StationService();
