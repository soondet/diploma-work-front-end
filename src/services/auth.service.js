import axios from "axios";

const API_URL = "http://195.2.67.225:8080/api/auth/";

class AuthService {
  getUsers() {
    return axios.get(API_URL + `get`);
  }

  save(id, username, email, password, roles, bus) {
    return axios.post(API_URL + "save", {
      id,
      username,
      email,
      password,
      roles,
      bus,
    });
  }

  login(username, password) {
    return axios
      .post(API_URL + "signin", { username, password })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
    });
  }
}

export default new AuthService();
