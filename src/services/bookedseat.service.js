import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/bookedseat/";

class BookedSeatService {
  get() {
    return axios.get(API_URL + `get`);
  }
  getByScheduleId(scheduleId) {
    return axios.get(API_URL + `getByScheduleId?scheduleId=${scheduleId}`);
  }
  createBookedSeatByIds(scheduleId, seatNo) {
    return axios.post(API_URL + "createByIds", {
      scheduleId,
      seatNo,
    });
  }
}

export default new BookedSeatService();
