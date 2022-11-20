import axios from "axios";
import { API } from "../Assets";
import { getCookie } from "../main";

const header = {
    headers: {
        Authorization: "Bearer " + getCookie('token')
    }
}

class AuthService {
    static isAdmin() {
        return axios.post(API + '/auth/is-admin', {}, header)
    }
}

export default AuthService;


export function connectToWS(endpoint){
    const socket = new WebSocket('ws://localhost:3000' + endpoint);

    socket.addEventListener('open', ()=> {
      console.log('connected to the websocket with endpoint ' + endpoint);
      return socket;
    })

    socket.addEventListener('error', () => {
        console.log('failed to connect to websocket with endpoint ' + endpoint);
        return null;
    })

    //socket.addEventListener('message', (data) => {
    //  const message = JSON.parse(data.data)
    //  console.log(message)
    //})
}