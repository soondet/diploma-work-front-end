import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://195.2.67.225:8080/api/schedule/";

class ScheduleService {
  getSchedule(filters) {
    return axios.get(
      API_URL +
      `address?addressFromId=${filters.addressFrom}&addressToId=${filters.addressTo}&date=${filters.date}`
    );
  }

  createSchedule(route, bus, status, date, price, availableSeatNumber) {
    return axios.post(API_URL + "create", {
      route,
      bus,
      status,
      date,
      price,
      availableSeatNumber
    });
  }

  getOneSchedule(routeId, busId, date) {
    return axios.get(
      API_URL +
      `routeBus?routeId=${routeId}&busId=${busId}&date=${date}`
    );
  }
}

export default new ScheduleService();
