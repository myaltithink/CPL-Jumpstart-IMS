import axios from "axios";
import { API } from "../Assets";

class GuestService {

    static performAuthentication(data){
        return axios.post(API + "/auth/perform-login", {
            username: data.username,
            password: data.password
        });
    }

    static isTokenValid(token) {
        return axios.post(API + '/is-token-valid', {}, {
            headers: {
                Authorization: "Bearer " + token
            }
        });
    }

    static sendMessage(data){
        return axios.post(API + '/contact-us', data);
    }

}

export default GuestService;