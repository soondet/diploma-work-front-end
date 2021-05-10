import axios from "axios";
import authHeader from "./auth-header";
import * as qs from 'qs'

const API_URL = "http://localhost:8080/api/sequence/";

class SequenceService {
  getSequenceAddressesByRouteId(routeId) {
    return axios.get(API_URL + `addresses?routeId=${routeId}`);
  }
  createSequence(route, address, sequenceNumber) {
    return axios.post(API_URL + "create", {
      route,
      address,
      sequenceNumber,
    });
  }
  getSequenceRouteIdsByAddressIds(addressIds) {
    return axios.get(`routes`, {
      params: {
        addressIds: addressIds,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    });
  }
}

export default new SequenceService();
