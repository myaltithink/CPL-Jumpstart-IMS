import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import Login from './Login'
import './assets/styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Route, BrowserRouter, Routes} from 'react-router-dom';
import Footer from './component/Footer'
import AuthIndex from './auth/AuthIndex'
import GuestService from './service/GuestService'

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

function getCookie(cookieName) {
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
                <Route path='/test' element={<AuthIndex user={user} test="test att" test2="test 2 att"/>}/>
            </Route>
        </Routes>
        <Footer/>
    </BrowserRouter>
)
