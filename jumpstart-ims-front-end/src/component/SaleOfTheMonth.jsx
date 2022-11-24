import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { emptyRegex, numberRegex } from "../Assets";
import AuthService, { connectToWS } from "../service/AuthService";

export default function SaleOfTheMonth(){

    const [saleOfTheMonth, setSaleOfTheMonth] = useState({
        month: '',
        total: 0
    })
    const [socket, setSocket] = useState({
        salesSocket: null
    })

    useEffect(() => {
        const getRecord = async () => {
            const record = await (await AuthService.getSaleRecord()).data;
            setSaleOfTheMonth({
                month: record.month,
                total: record.total
            });
            sessionStorage.setItem("view-data", record.month)
        }
        const connectoToSocket = () => {
            let salesWS = connectToWS("/sales/update");

            salesWS.addEventListener("open", () => {
                console.log("total sales is now listening for updates")
            })
    
            salesWS.addEventListener("message", () => {
                getRecord();
            })
            setSocket({
                salesSocket: salesWS
            })
        }
        getRecord();
        connectoToSocket();
    }, [])

    const [show, setShow] = useState(false)

    const [formData, setFormData] = useState({
        prodName: '',
        quantity: '',
        price: '',

        prodNameError: '',
        quantityError: '',
        priceError: '',
        hasError: true
    });

    const handleModal = async (e) => {
        if (e != undefined || e != null) {
            if (e.target.id == "submit") {
                const data = {
                    recordName: saleOfTheMonth.month,
                    productName: formData.prodName,
                    quantity: formData.quantity,
                    price: formData.price
                }
                const res = await (await AuthService.addTransaction(data)).data
                if (res.transactionSuccess) {
                    socket.salesSocket.send(JSON.stringify({message: "NEW_TRANSACTION"}));
                }
            }    
        }

        setShow(!show)
    }

    const handleFormInput = (e) => {
        const input = e.target;

        let invalid = false;
        if (emptyRegex.test(input.value)) {
            setFormData({
                ...formData,
                [input.id]: input.value,
                [input.id + "Error"]: "This field is required",
                hasError: true
            })
            invalid = true;
            return;
        }

        if (input.id == "quantity"){
            if (!numberRegex.test(input.value)) {
                setFormData({
                    ...formData,
                    [input.id]: input.value,
                    [input.id + "Error"]: "Invalid Value",
                    hasError: true
                })
                invalid = true;
                return;
            }
        }

        if (input.id == "price") {
            if (input.value.includes("-") || input.value.includes("+")) {
                if (!numberRegex.test(input.value)) {
                    setFormData({
                        ...formData,
                        [input.id]: input.value,
                        [input.id + "Error"]: "Invalid Value",
                        hasError: true
                    })
                    invalid = true;
                    return;
                }
            }
        }
        setFormData({
            ...formData,
            [input.id]: input.value,
            [input.id + "Error"]: "",
            hasError: invalid
        })
    }

    return (
        <div style={{height: '93%'}} className="d-flex justify-content-center align-items-center m-3">
            <div style={{padding: '40px 80px'}} className="d-flex align-items-center justify-content-center col-12 h-100 border border-3 border-dark rounded text-center shadow" >
                <div>
                    <h3>Total Sale of <br /> {saleOfTheMonth.month}</h3>
                    <h4>${saleOfTheMonth.total}</h4>

                    {(window.location.pathname == "/store-dashboard")?
                        <button type="button" className="btn"><a href="/sale-records/record-list" className="text-dark">View Sale Record</a></button>
                    :
                        null
                    }

                    {(window.location.pathname == "/sale-records/record-list")? 
                        <div>
                            <button type="button" className="btn" onClick={handleModal}><a className="text-dark">Add Transaction</a></button>
                        </div>
                    : 
                        null
                    }
                </div>
             </div>
             
            <Modal show={show} onHide={handleModal}>
              <Modal.Header closeButton>
                <Modal.Title>Add Transaction</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Use the form below to add a transaction of the day for an item</p>
                <Form onInput={handleFormInput}>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control id="prodName"></Form.Control>
                    <small className="text-danger">{formData.prodNameError}</small><br />
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control id="quantity"></Form.Control>
                    <small className="text-danger">{formData.quantityError}</small><br />
                    <Form.Label>Price <small className="text-secondary"><i>(singular price of the item)</i></small></Form.Label>
                    <Form.Control id="price" type="number"></Form.Control>
                    <small className="text-danger">{formData.priceError}</small>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleModal}>
                  Close
                </Button>
                <Button variant="primary" id="submit" disabled={formData.hasError} onClick={handleModal}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
        </div>
    )
}