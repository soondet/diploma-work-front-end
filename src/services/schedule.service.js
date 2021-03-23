import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://195.2.67.225:8080/api/schedule/";

class ScheduleService {
  getSchedule(filters) {
    console.log(filters);
    return axios.post(API_URL + "get", {
      cityFrom: filters.cityFrom,
      cityTo: filters.cityTo,
      date: filters.date,
    });
  }
}

export default new ScheduleService();
