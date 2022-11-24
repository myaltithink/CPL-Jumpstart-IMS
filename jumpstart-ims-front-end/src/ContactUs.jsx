import { Button, Form } from "react-bootstrap";
import Footer from "./component/Footer";

export default function ContactUs(){
    return(
        <div>
            <div className="border border-top-0 border-start-0 border-end-0 border-dark p-3 position-sticky top-0 bg-secondary" style={{width: "100vw"}}>
                <a href="/" className="btn btn-primary me-2">Login</a>
                <a href="/terms-and-condition" className="btn btn-primary">Terms and Condition</a>
            </div>
            <div style={{height: '75vh'}} className="border">
                <div style={{height: '75vh'}} className="d-flex justify-content-center align-items-center">
                    <Form className="border border-3 rounded shadow p-4 col-7">
                        <p>Send us a message using the form below</p>
                        <Form.Label>Email/Username:</Form.Label>
                        <Form.Control></Form.Control>
                        <br />
                        <Form.Label>Message:</Form.Label>
                        <Form.Control as="textarea" rows={10}></Form.Control>
                        <br />
                        <Button className="w-100" type="button">Submit</Button>
                    </Form>
                </div>
            </div>
            <Footer/>
        </div>
    )
}