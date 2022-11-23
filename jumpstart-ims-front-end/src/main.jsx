import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import Login from './Login'
import './assets/styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Route, BrowserRouter, Routes} from 'react-router-dom';
import AuthIndex from './auth/AuthIndex'
import GuestService from './service/GuestService'
import Denied from './Denied'
import StoreDashboard from './auth/StoreDashboard'
import AdminDashboard from './auth/AdminDashboard'
import AdminRoute from './route-handler/AdminRoute'
import UserRoute from './route-handler/UserRoute'
import Logout from './component/Logout'
import IMSLayout from './component/IMSLayout'
import DashboardNav from './component/DashboardNav'
import ContentHandler from './component/ContentHandler'
import UserInventory from './auth/UserInventory'
import UserInventories from './auth/UserInventories'
import RecordSales from './auth/RecordedSales'
import RecordedSales from './auth/RecordedSales'
import SaleRecords from './auth/SaleRecords'

export let socket = null;

let user = {
    authenticated: false
};

function updateUserAuthentication(userAuthenticated){
    user = {
        ...user,
        authenticated: userAuthenticated
    }
}

export function getCookie(cookieName) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let [key,value] = el.split('=');
      cookie[key.trim()] = value;
    })
    return cookie[cookieName];
}

const token = getCookie('token');
if(token != undefined && token != null){
    const res = await(await GuestService.isTokenValid(token)).data;
    (res.tokenValid)? updateUserAuthentication(true) : updateUserAuthentication(false);
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path='/'>
                <Route index element={<Login/>}/>
                <Route path='/permission-denied' element={<Denied/>}/>
                <Route path='/auth' element={ <UserRoute user={user} component={<AuthIndex/>}/> }/>
                <Route path='/store-dashboard' element={ <UserRoute user={user} component={<StoreDashboard/>}/> }/>
                <Route path='/admin-dashboard' element={ <AdminRoute user={user} component={<AdminDashboard/>}/> }/>
                <Route path='/my-inventory' element={<UserRoute user={user} component={<UserInventory/>}/>}/>
                <Route path='/user-inventories' element={<AdminRoute user={user} component={<UserInventories/>}/>}/>
                <Route path='/view/user-inventory' element={<AdminRoute user={user} component={<UserInventory/>}/>}/>
                <Route path='/sale-records' element={<UserRoute user={user} component={<RecordSales/>}/>}/>
                <Route path='/sale-records/record-list' element={<UserRoute user={user} component={<SaleRecords/>}/>}/>
                <Route path='/view/sale-record' element={<UserRoute user={user} component={<SaleRecords/>}/>}/>
                <Route path='/logout' element={<Logout/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
)
