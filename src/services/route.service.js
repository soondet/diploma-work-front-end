import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://195.2.67.225:8080/api/route/";

class RouteService {
  createRoute(haversine_km) {
    return axios.post(API_URL + "create", {
      distance: haversine_km,
      price: 3000,
    });
  }
  getRoutes() {
    return axios.get(API_URL + "get");
  }
}

export default new RouteService();
