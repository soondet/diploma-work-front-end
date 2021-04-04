import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://195.2.67.225:8080/api/seatplace/";

class SeatPlaceService {
  getByBusModelId(busModelId) {
    return axios.get(API_URL + `getByBusModelId?busModelId=${busModelId}`);
  }
}

export default new SeatPlaceService();
