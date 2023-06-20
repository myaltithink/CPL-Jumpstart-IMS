import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { emptyRegex, numberRegex } from "../Assets";
import AuthService, { connectToWS } from "../service/AuthService";

export default function InventoryCapacity(props){

    const [inventory, setInventory] = useState({
        items: 0,
        max: 0,
        percent: 0,
        isAdmin: false
    });

    const [modal, setModal] = useState({
        show: false,
        modal: ''
    })

    const [formData, setFormData] = useState({
        capacity: 0,
        capacityError: '',
        hasError: false,

        productName: '',
        barcode: '',
        quantity: '',
        price: '',

        productNameError: '',
        barcodeError: '',
        quantityError: '',
        priceError: '',
    });

    const [socket, setSocket] = useState({
        capacityWS: null,
        prodListWS: null
    });

    useEffect(() => {
        const getInventory = async () => {
            let inventoryData = null;
            if (props.view == "admin") {
                inventoryData = await (await AuthService.getUserInventoryCapacity(sessionStorage.getItem("view-data"))).data;
            }else {
                inventoryData = await (await AuthService.getInventoryCapacity()).data;
            }
            const isViewAdmin = await (await AuthService.isAdmin()).data
            setInventory({
                items: inventoryData.totalItems,
                max: inventoryData.capacity,
                percent: Math.ceil((inventoryData.totalItems / inventoryData.capacity) * 100),
                isAdmin: isViewAdmin
            })
            setFormData({
                ...formData,
                capacity: inventoryData.capacity
            })
        }

        const capacitySocket = connectToWS("/user/inventory/update");

        capacitySocket.addEventListener("open", () => {
            console.log("inventory capacity is now listening for updates");
        })

        capacitySocket.addEventListener("message", () => {
            getInventory();
        })

        const productSocket = connectToWS("/user/inventory/product/update");

        productSocket.addEventListener("open", () => {
            console.log("add product has connected to websoicket")
        })
        
        setSocket({
            capacityWS: capacitySocket,
            prodListWS: productSocket
        });
    
        getInventory();
    }, []);

    const handleModal = async (e) => {
        let showModal = ""
        if (e != undefined && e != null) {
            showModal = (e.target.id != "submit")? e.target.classList[0] : ""
            if(e.target.id == "submit"){
                if (e.target.classList[0] == "submit-capacity") {
                    const updateRes = await (await AuthService.updateInventoryCapacity({newCapacity : formData.capacity})).data;
                    if (updateRes.capacityUpdated) {
                        socket.capacityWS.send(JSON.stringify("UPDATE_CAPACITY"));
                    }
                }
                if (e.target.classList[0] == "submit-product") {
                    setFormData({
                        ...formData,
                        hasError: true
                    })
                    const product = await (await AuthService.addProduct({
                        productName: formData.productName,
                        barcode: formData.barcode,
                        quantity: formData.quantity,
                        price: formData.price,
                    })).data

                    if (product.product_error) {
                        setFormData({
                            ...formData,
                            quantityError: product.error_message
                        })
                        return;
                    }

                    socket.capacityWS.send(JSON.stringify("UPDATE_CAPACITY"));
                    socket.prodListWS.send(JSON.stringify(product.newProduct));
                }
            }
        }
        setModal({
            show: !modal.show,
            modal: showModal
        });
        setFormData({
            ...formData, 
            hasError: (showModal == "product-modal")? true: false
        })
    }

    const handleCapacityForm = async (e) => {
        const input = e.target;

        if (!numberRegex.test(input.value)) {
            setFormData({
                capacity: input.value,
                capacityError: 'Invalid Value',
                hasError: true
            })
            return;
        }
            
        if (Number(input.value) < inventory.items) {
            setFormData({
                capacity: input.value,
                capacityError: 'New Capacity cannot be lower than the current items',
                hasError: true
            })
            return;
        }
        
        setFormData({
            capacity: input.value,
            capacityError: '',
            hasError: false
        })
    }

    const handleProductForm = (e) => {
        const input = e.target
        if (emptyRegex.test(input.value)) {
            setFormData({
                ...formData,
                hasError: true,
                [input.id + "Error"]: "This field is required"
            })
            return;
        }

        if(input.id == "quantity"){
            if (!numberRegex.test(input.value)) {
                setFormData({
                    ...formData,
                    hasError: true,
                    [input.id + "Error"]: "Invalid Quantity"
                })
                return;
            }
        }

        if (input.id == "price") {
            if (input.value.includes("-") || input.value.includes("+")) {
                if (!numberRegex.test(input.value)) {
                    setFormData({
                        ...formData,
                        hasError: true,
                        [input.id + "Error"]: "Invalid Price"
                    })
                    return;
                }
            }
        }
        
        const form = input.parentElement;
        let valid = true;

        for (const formInput of form) {
            if (formInput.type == "text" || formInput.type == "number") {
                if (emptyRegex.test(formInput.value)) {
                    valid = false;
                    break;
                }
                if (input.id == "quantity"){
                    if (!numberRegex.test(input.value)) {
                        valid = false;
                        break;
                    }
                }
                if (input.id == "price") {
                    if (input.value.includes("-") || input.value.includes("+")) {
                        if (!numberRegex.test(input.value)) {
                            valid = false;
                            break;
                        }
                    }
                }
            }
        }

        setFormData({
            ...formData,
            hasError: !valid,
            [input.id]: input.value,
            [input.id + "Error"]: ""
        })

    }

    return (
        <div style={{height: '93%'}} className="d-flex justify-content-center m-3">
            <div className="col-12 border border-3 border-dark rounded text-center shadow d-flex align-items-center justify-content-center" >
                <div className="p-3">
                    <div className='d-flex justify-content-center mb-3'>
                        <div style={{height: '100px', width: '100px'}}>
                            <CircularProgressbar value={inventory.percent} text={`${inventory.percent}%`}/>
                        </div>
                    </div>
                    <h4>Inventory Capacity</h4>
                    <h5>{inventory.items} / {inventory.max}</h5>
                    {(!inventory.isAdmin)? 
                        <div>
                            <button type="button" className="btn" onClick={handleModal}><a className="capacity-modal text-dark">Update Max Inventory</a></button>

                            {(window.location.pathname.includes("/my-inventory"))? 
                                <button type="button" className="btn" onClick={handleModal}><a className="product-modal text-dark">Add Product</a></button>
                            : 
                                <button type="button" className="btn"><a href="/my-inventory" className="text-dark">View Inventory</a></button>
                            }
                        </div>
                    : 
                        null
                    }
                </div>
            </div>
             
            <Modal show={modal.show} onHide={handleModal}>
              <Modal.Header closeButton>
                <Modal.Title>{(modal.modal == "product-modal")? "Add New Product" : "Update Inventory Capacity"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {(modal.modal == "product-modal")? 
                    <div>
                        <Form onInput={handleProductForm}>
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control id="productName"></Form.Control>
                            <small className="text-danger">{formData.productNameError}</small> <br />
                            <Form.Label>Barcode</Form.Label>
                            <Form.Control id="barcode"></Form.Control>
                            <small className="text-danger">{formData.barcodeError}</small> <br />
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control id="quantity"></Form.Control>
                            <small className="text-danger">{formData.quantityError}</small> <br />
                            <Form.Label>Price</Form.Label>
                            <Form.Control id="price" type="number"></Form.Control>
                            <small className="text-danger">{formData.priceError}</small>
                        </Form>
                    </div>
                :
                    <div>
                        <p>Use the field below to update your inventory capacity</p>
                        <Form>
                            <Form.Label>New Capacity</Form.Label>
                            <Form.Control id="capacity" value={formData.capacity} onChange={handleCapacityForm}></Form.Control>
                            <small className="text-danger">{formData.capacityError}</small>
                        </Form>
                    </div>
                }
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleModal}>
                  Close
                </Button>
                <Button variant="primary" id="submit" className={`${(modal.modal == "product-modal")? "submit-product" : "submit-capacity"}`} disabled={formData.hasError} onClick={handleModal}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
        </div>
    )
}