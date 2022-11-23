import axios from "axios";
import { API } from "../Assets";
import { getCookie } from "../main";

const header = {
    headers: {
        Authorization: "Bearer " + getCookie('token')
    }
}

class AuthService {
    isAdmin() {
        return axios.post(API + '/auth/is-admin', {}, header);
    }

    registerStore(data){
        return axios.post(API + "/auth/add-store", data, header);
    }

    getUserCount(){
        return axios.get(API + '/admin/get-user-count', header);
    }

    getUsers(){
        return axios.get(API + "/admin/get-users", header);
    }

    getInventoryCapacity(){
        return axios.post(API + "/store/get-inventory-capacity", {}, header);
    }

    getUserInventoryCapacity(username){
        return axios.post(API + "/store/get-inventory-capacity/" + username, {}, header);
    }

    updateInventoryCapacity(data){
        return axios.post(API + "/store/update-inventory-capacity", data, header);
    }

    addProduct(data){
        return axios.post(API + "/store/add-product", data, header);
    }

    getProducts(){
        return axios.post(API + "/store/get-products", {}, header);
    }

    getInventories(){
        return axios.post(API + "/admin/get-user-inventories", {}, header);
    }

    getUserInventory(username){
        return axios.post(API + "/store/get-products/" + username, {}, header);
    }

    getSaleRecord(){
        return axios.post(API + "/store/total-sale", {}, header);
    }

    getStoreSaleRecords(){
        return axios.post(API + "/store/get-store-sale-records", {}, header);
    }

    getSaleRecordOf(month){}
    //add a header 'Content-Type': 'multipart/form-data' to upload files

}

export default new AuthService();

async function checkAdminPermission(){
    const isAdmin = (await new AuthService().isAdmin()).data;
    if (!isAdmin) {
        return false;
    }
}



export function connectToWS(endpoint){
    const socket = new WebSocket('ws://localhost:3000' + endpoint);
    
    socket.addEventListener('error', () => {
        console.log('failed to connect to websocket with endpoint ' + endpoint);
    })

    return socket;

    //socket.addEventListener('message', (data) => {
    //  const message = JSON.parse(data.data)
    //  console.log(message)
    //})
}