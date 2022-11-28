import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import Footer from "./component/Footer";
import GuestService from "./service/GuestService";

export default function ContactUs(){

    const [message, setMessage] = useState({
        sender: '',
        message: ''
    });

    const [sent, setSent] = useState(false);

    const handleInput = (e) => {
        setMessage({
            ...message,
            [e.target.id]: e.target.value
        })
    }

    const submitMessage = async () => {
        const res = await (await GuestService.sendMessage(message)).data

        if (res.message_sent) {
            setSent(true);
        }

        setTimeout(() => {setSent(false)}, 2000);
    }

    return(
        <div>
            <div className="border border-top-0 border-start-0 border-end-0 border-dark p-3 position-sticky top-0 bg-secondary" style={{width: "100vw"}}>
                <a href="/" className="btn btn-primary me-2">Login</a>
                <a href="/terms-and-condition" className="btn btn-primary">Terms and Condition</a>
            </div>
            <div className="border">
                <div style={{height: 'fit-content'}} className="d-flex justify-content-center align-items-center mb-5">
                    <Form className="border border-3 rounded shadow p-4 col-11 col-md-7">
                        <p>Send us a message using the form below</p>
                        <Form.Label>Email/Username:</Form.Label>
                        <Form.Control id="sender" onChange={handleInput}></Form.Control>
                        <br />
                        <Form.Label>Message:</Form.Label>
                        <Form.Control as="textarea" id="message" rows={10} onChange={handleInput}></Form.Control>
                        <br />
                        <Button className="w-100" type="button" onClick={submitMessage}>Submit</Button>
                        {(sent)? <Alert className="mt-2" variant="success">Message has been sent</Alert> : null}
                        
                    </Form>
                </div>
            </div>
            <Footer/>
        </div>
    )
}