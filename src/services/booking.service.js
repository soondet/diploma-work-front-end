import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/booking/";

class BookingService {
  createBookingByIds(scheduleId, userId, seatNo) {
    return axios.post(API_URL + "createByIds", {
      scheduleId,
      userId,
      seatNo,
    });
  }

  getByUserId(userId) {
    return axios.get(API_URL + `getByUser?userId=${userId}`);
  }
}

export default new BookingService();
