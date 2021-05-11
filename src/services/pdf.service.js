import axios from "axios";
import authHeader from "./auth-header";

export const API_URL = "http://195.2.67.225:8080/api/pdf/";

class PdfService {
  download(id) {
    return axios.get(API_URL + `download?id=${id}`);
  }
  send(id, email) {
    return axios.get(API_URL + `send?id=${id}&email=${email}`);
  }
}

export default new PdfService();
