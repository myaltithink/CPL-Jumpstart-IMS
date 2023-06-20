import { useCallback, useEffect, useState } from 'react'
import { assets } from './Assets';
import './assets/styles/App.css';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom';
import GuestService from './service/GuestService';
import Footer from './component/Footer';

function Login() {

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
const [form, setForm] = useState({
  usernameError:  '',
  passwordError: ''
})

const Login = async (e) => {
  const form = e.target.parentElement;
  const data = {
    username: form[0].value,
    password: form[1].value
  }
  const res = await (await GuestService.performAuthentication(data)).data;
  if (res.success) {
    document.cookie = `token=${res.accessToken};`;
    window.location.href = "/auth";
    return;
  }
  setForm({
    [res.errorIn + "Error"]: res.errorMessage
  })
}

return (
  <div className="App">
    <div className="login-container d-block d-md-flex">
      <div className="img-background-contain login-img col-12 col-md-6" style={{backgroundImage: `url(${assets.login_vector})`}}></div>
      <div id="login-form" className='mt-3 mt-md-0'>
        <div className='col-12 col-lg-10 col-xl-8'>
          <div className=''>
            <h5>Welcome to Jumpstart Inventory Management System</h5>
            <p>Manage your Jumpstart inventory by Signing in</p>
            <p>If you are having any issue, kindly send us a message using the <Link to='/contact-us'>Contact Us Page</Link> or send us a message at our email address <Link to="#">tarucisaac@gmail.com</Link></p>
          </div>
          <form className='border border-3 rounded shadow-lg p-3'>
            <h3>Jumpstart IMS Login</h3>
            <div className='mb-2'>
              <label htmlFor="username">Username:</label>
              <input type="text" name='username' className='form-control'/>
              <small className='text-danger'>{form.usernameError}</small>
            </div>
            <div className='mb-3'>
              <label htmlFor="password">Password:</label>
              <div className="d-flex align-items-center form-control p-0">
                <input type={password.type} className="password border-0 rounded-0 w-100" id="password"/>
                <button type="button" className="h-100 p-2 border-0 bg-white rounded" onClick={passwordHandler}>
                  {(password.type == "password")? <FontAwesomeIcon icon={faEyeSlash}/>: <FontAwesomeIcon icon={faEye}/>}
                </button>
              </div>
              <small className='text-danger'>{form.passwordError}</small>
            </div>
            <button type='button' className='btn btn-primary w-100' onClick={Login}>Login</button>
          </form>
        </div>
      </div>
    </div>
        <Footer/>
  </div>
)
}

export default Login