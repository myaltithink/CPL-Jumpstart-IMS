import { useEffect, useState } from 'react'
import { assets } from './Assets';
import './assets/styles/App.css';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

function Login() {
const [count, setCount] = useState(0)

const socket = new WebSocket('ws://localhost:3000/test');

socket.addEventListener('open', ()=> {
  console.log('connected to the websocket')
})

socket.addEventListener('message', (data) => {
  const message = JSON.parse(data.data)
  console.log(message)
})


const sendJson = ()=> {
socket.send(JSON.stringify({
  test: 'dwasd',
  test2: 'vcbv',
  test3: 'dwafawf'
}));
}


const passwordHandler = (e) => {
  const password = document.getElementsByClassName("password");
  if (password[0].type === "password") {
    setPassword({
      type: "text"
    })
  }else {
    setPassword({
      type: "password"
    })
  }
}

const [password, setPassword] = useState({type: 'password'})

return (
  <div className="App">
    <div className="login-container d-block d-md-flex">
      <div className="img-background-contain login-img col-12 col-md-6" style={{backgroundImage: `url(${assets.login_vector})`}}></div>
      <div id="login-form" className='mt-3 mt-md-0'>
        <div className='col-12 col-lg-10 col-xl-8'>
          <div className=''>
            <h5>Welcome to Jumpstart Inventory Management System</h5>
            <p>Manage your Jumpstart inventory by Logging on</p>
            <p>If you are having any issue, kindly send us a message using the <Link to='#'>Contact Us Page</Link> or send us a message at our email address <Link to="#">tarucisaac@gmail.com</Link></p>
          </div>
          <form action="" className='border border-3 rounded shadow-lg  p-3'>
            <h3>Jumpstart IMS Login</h3>
            <div className='mb-2'>
              <label htmlFor="username">Username:</label>
              <input type="text" name='username' className='form-control'/>
            </div>
            <div className='mb-3'>
              <label htmlFor="password">Password:</label>
              <div className="d-flex align-items-center form-control p-0">
                <input type={password.type} className="password border-0 rounded-0 w-100" id="password"/>
                <button type="button" className="h-100 p-2 border-0 bg-white rounded" onClick={passwordHandler}>
                  {(password.type == "password")? <FontAwesomeIcon icon={faEyeSlash}/>: <FontAwesomeIcon icon={faEye}/>}
                </button>
              </div>
            </div>
            <button type='submit' className='btn btn-primary w-100'>Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
)
}

export default Login