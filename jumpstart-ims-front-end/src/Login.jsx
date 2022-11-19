import { useEffect, useState } from 'react'
import { assets } from './Assets';
import './assets/styles/App.css'

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

return (
  <div className="App">
    <div className="img-background" style={{backgroundImage: `url(${assets.login_vector})`}}></div>
    <div id="login-form">
      <form action="">
        <h3>Jumpstart IMS Login</h3>
        <label htmlFor="username">Username:</label>
        <input type="text" name='username' className='form-control'/>
        <div>
          <label htmlFor="password">Password:</label>
          <div className="d-flex align-items-center form-control p-0">
            <input type='password' className="password border-0 rounded-0" id="password"/>
            <button type="button" className="h-100 p-2 border-0 bg-white rounded">
              <i className='fa faEyeSlash'></i>
              
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)
}

export default Login