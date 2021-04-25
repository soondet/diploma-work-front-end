import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/address/";

class AddressService {
  getAddressByCity(cityId) {
    return axios.get(API_URL + `city?cityId=${cityId}`);
  }
}

export default new AddressService();
