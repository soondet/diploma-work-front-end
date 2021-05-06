import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/bus/";

class BusService {
  getBus() {
    return axios.get(API_URL + "get");
  }

  getBusesByPark(parkId) {
    return axios.get(API_URL + `getByPark?parkId=${parkId}`);
  }

  createBus(park, busModel, stateNumber, availability, seatNumber) {
    return axios.post(API_URL + "create", {
      park,
      busModel,
      stateNumber,
      availability,
      seatNumber,
    });
  }

  editBus(id, park, busModel, stateNumber, availability, seatNumber) {
    return axios.post(API_URL + "create", {
      id,
      park,
      busModel,
      stateNumber,
      availability,
      seatNumber,
    });
  }

  deleteById(busId) {
    return axios.delete(API_URL + `deleteById?busId=${busId}`);
  }
}

export default new BusService();
