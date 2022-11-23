import { faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { emptyRegex } from "../Assets";
import AuthService, { connectToWS } from "../service/AuthService";


export default function AdminOperation(){
    
    const [socket, setSocket] = useState({
        socket: null,
        inventorySocket: null
    });

    const [show, setShow] = useState(false);
    
    const [password, setPassword] = useState({type: 'password'})

    const formRef = useRef();

    const [formData, setFormData] = useState({
       storeName: '',
       storeAddress: '',
       storeContact: '',
       username: '',
       password: '',
    });

    const [formError, setFormError] = useState({
        storeNameError: '',
        storeAddressError: '',
        storeContactError: '',
        usernameError: '',
        passwordError: '',

        submitDisabled: true
    })

    useEffect(() => {
        const connectToWebSocket = () => {
            const socket = connectToWS("/admin-dashboard/update")
            socket.addEventListener('open', () => {
                console.log("admin operations has connected to user update socket");
            })

            const inventorySocket = connectToWS("/admin/user-inventories/update");
            inventorySocket.addEventListener('open', () => {
                console.log("admin operations has connected to inventory update socket")
            })
            setSocket({
                socket: socket,
                inventorySocket: inventorySocket
            })
        }
        connectToWebSocket()
    }, [])

    const handleModal = async (e) => {
        
        if (e != undefined || e != null) {
            if(e.target.id == "submit"){
                const res = await (await AuthService.registerStore(formData)).data;
                if (!res.registration_success) {
                    setFormError({
                        ...formError,
                        usernameError: res.message,
                        submitDisabled: true
                    });
                    return;
                }else {
                    socket.socket.send(JSON.stringify({message: "NEW_USER"}));
                    socket.inventorySocket.send(JSON.stringify({message: "NEW_USER"}));
                }
            }
        }
        setShow(!show);
        setFormError({
            ...formError,
            usernameError: '',
            submitDisabled: true
        })
    }

    const passwordHandler = (e) => {
        (password.type === 'password') ? setPassword({type: "text"}) : setPassword({type: "password"});
    }

    const handleFormInput = (e) => {
        const form = formRef.current;

        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })

        let error = (emptyRegex.test(e.target.value)) ? "This field is required." : "";

        for (const input of form) {
            if (input.type === "text" || input.type == "password") {
                if (emptyRegex.test(input.value)) {
                    setFormError({
                        ...formError,
                        [e.target.id + "Error"]: error,
                        submitDisabled: true
                    })
                    return;
                }
            }
        }

        setFormError({
            ...formError,
            [e.target.id + "Error"]: error,
            submitDisabled: false
        })
    }
 

    return (
        <div style={{height: '93%'}} className="d-flex justify-content-center m-2">
            <div className="col-12 border border-3 border-dark rounded text-center shadow d-flex align-items-center justify-content-center" >
                <div className="pt-4 pb-4">   
                    <h2>Operations</h2>
                    <button className="btn btn-primary col-10 m-2 pt-3 pb-3" style={{fontSize: '20px'}} onClick={handleModal}>Add New User</button>
                    <button className="btn btn-primary col-10 m-2 pt-3 pb-3" style={{fontSize: '20px'}}><a href="/user-inventories" className="text-light text-decoration-none">View User Inventory</a></button>
                </div>
             </div>

            <Modal show={show} onHide={handleModal}>
              <Modal.Header closeButton>
                <Modal.Title>Register User</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p className="mb-0">Please fill up the following fields</p>
                <Form onInput={handleFormInput} ref={formRef}>
                    <h4>Store Info</h4>
                    <Form.Label>Store Name <i>(required)</i></Form.Label>
                    <Form.Control id="storeName"></Form.Control>
                    <small className='text-danger'>{formError.storeNameError}</small><br />
                    <Form.Label>Store Address <i>(required)</i></Form.Label>
                    <Form.Control id="storeAddress"></Form.Control>
                    <small className='text-danger'>{formError.storeAddressError}</small><br />
                    <Form.Label>Store Contact <i>(required)</i></Form.Label>
                    <Form.Control id="storeContact"></Form.Control>
                    <small className='text-danger'>{formError.storeContactError}</small><br />
                    <h4 className="mt-2">Credentials</h4>
                    <Form.Label>Username <i>(required)</i></Form.Label>
                    <Form.Control id="username"></Form.Control>
                    <small className='text-danger'>{formError.usernameError}</small><br />
                    <Form.Label>Password <i>(required)</i></Form.Label>
                    <div className="d-flex align-items-center form-control p-0">
                      <input type={password.type} className="password border-0 rounded-0 w-100" id="password"/>
                      <button type="button" className="h-100 p-2 border-0 bg-white rounded" onClick={passwordHandler}>
                        {(password.type == "password")? <FontAwesomeIcon icon={faEyeSlash}/>: <FontAwesomeIcon icon={faEye}/>}
                      </button>
                    </div>
                    <small className='text-danger'>{formError.passwordError}</small>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleModal}>
                  Close
                </Button>
                <Button variant="primary" disabled={formError.submitDisabled} onClick={handleModal} id="submit">
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
        </div>
    )
}