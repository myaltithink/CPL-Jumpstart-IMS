import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './Login'
import './assets/styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Route, BrowserRouter, Routes} from 'react-router-dom';
import Footer from './component/Footer'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path='/'>
                <Route index element={<Login/>}/>
            </Route>
        </Routes>
        <Footer/>
    </BrowserRouter>

)
