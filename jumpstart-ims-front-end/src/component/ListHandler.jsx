import { faMagnifyingGlass, faPencil, faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import '../assets/styles/list.css'
import AuthService, { connectToWS } from '../service/AuthService';
import Loading from './Loading';


export default function ListHandler(props){

    const [list, setList] = useState({
        title: [],
        list: [],
        originalList: [],
        isLoading: true,
        isViewable: false,
    })

    let count = 0;

    const [socket, setSocket] = useState({
        userSocket: null,
        prodSocket: null,
        inventories: null,
        salesSocket: null,
        invCapacitySocket: null
    })


    useEffect(() => {
        const getData  = async () => {
            count = 0;
            switch (props.list) {
                case "users":
                    const res = await (await AuthService.getUsers()).data;
                    setList({
                        originalList: res,
                        list: res,
                        isLoading: false,
                        isViewable: false,
                        title: ["Store Name", "Address", "Contact", "Username", "Registered At"]
                    })
                break;

                case "products":
                    const prodRes = await (await AuthService.getProducts()).data;
                    let titles = ["Product Name", "Barcode", "Quantity", "Price", "Updated At", "Action"];
                    setList({
                        originalList: prodRes,
                        list: prodRes,
                        isLoading: false,
                        isViewable: false,
                        title: titles
                    })
                break;

                case "inventories": 
                    const inventories = await (await AuthService.getInventories()).data;
                    setList({
                        originalList: inventories,
                        list: inventories,
                        isLoading: false,
                        isViewable: true,
                        title: ["Store Name", "Username", "Total Items", "Capacity", "Created At", "Action"]
                    })
                break;

                case "user-inventory":
                    const username = sessionStorage.getItem("view-data");
                    const userProds = await (await AuthService.getUserInventory(username)).data
                    setList({
                        originalList: userProds,
                        list: userProds,
                        isLoading: false,
                        isViewable: false,
                        title: ["Product Name", "Barcode", "Quantity", "Price", "Updated At", "Action"]
                    })
                break;

                case "sale-records":
                    const saleRecords = await (await AuthService.getStoreSaleRecords()).data;
                    setList({
                        originalList: saleRecords,
                        list: saleRecords,
                        isLoading: false,
                        isViewable: true,
                        title: ["Sale Record", "Total", "Transactions", "Created At", "Action"]
                    })
                break;

                case "sales-of":
                    const record = sessionStorage.getItem("view-data");
                    const records = await (await AuthService.getTransactions(record)).data
                    setList({
                        originalList: records,
                        list: records,
                        isLoading: false,
                        isViewable: false,
                        title: ["Product Name", "Quantity", "Price", "Total", "Soldt At"]
                    })
                break;
            }
        }

        let userWS = null;
        let prodWS = null;
        let invWS = null;
        let saleWS = null;
        let invCapWS = null;

        const openWS = async () => {
            const pathname = window.location.pathname;

            if (await (await AuthService.isAdmin()).data || pathname.includes("/admin-dashboard")) {
                userWS = connectToWS("/admin-dashboard/update");
    
                userWS.addEventListener('open', () => {
                    console.log("list handler has connected to user websocket")
                })
                
                userWS.addEventListener('message', (message) => {
                    getData();
                })

                invWS = connectToWS("/admin/user-inventories/update");
                
                invWS.addEventListener('open', () => {
                    console.log("list handler is now listening for inventories update")
                })

                invWS.addEventListener("message", (message) => {
                    getData();
                })
            }
            
            if (pathname.includes('/store-dashboard') || pathname.includes('/my-inventory') || pathname.includes("/view/user-inventory")) {
                console.log("aa")
                prodWS = connectToWS("/user/inventory/product/update");
                
                prodWS.addEventListener('open', () => { 
                    console.log("list handler has connected to product websocket")
                })
                
                prodWS.addEventListener('message', (message) => {
                    getData();
                })

                invCapWS = connectToWS("/user/inventory/update");

                invCapWS.addEventListener("open", () => {
                    console.log("list handler can now send updates to inventory capacity");
                })

            }

            if (pathname.includes("/sale-records") || pathname.includes("/view/sale-record")) {
                saleWS = connectToWS("/sales/update");

                saleWS.addEventListener("open", () => {
                    console.log("list handler is now listening for sales update");
                })

                saleWS.addEventListener("message", (message) => {
                    getData();
                });
            }
            setSocket({
                userSocket: userWS,
                prodSocket: prodWS,
                inventories: invWS,
                salesSocket: saleWS,
                invCapacitySocket: invCapWS
            })
        }

        getData();
        openWS();
    }, [])

    const searchHandler = (e) => {
        count = 0;
        let displayList = [];
        for (const item of list.originalList) {
            for (const key in item) {
                let value = String(item[key]);
                if (value.includes(e.target.value)) {
                    displayList.push(item)
                    break;
                }
            }
        }
        setList({
            ...list,
            list: displayList
        })
    }

    const handleView = (e) => {
        if (e.target.id.includes("view-inventory-")) {
            sessionStorage.setItem("view-data", e.target.id.split("-")[2])
            window.location.href = "/view/user-inventory"
        }

        console.log(e.target.id.split("-"))

        if (e.target.id.includes("view-record-")) {
            const id = e.target.id.split("-");
            const date = id[2] + "-" + id[3];
            sessionStorage.setItem("view-data", date);
            window.location.href = "/view/sale-record";
        }
    }

    const [modal, setModal] = useState({
        showEdit: false,
        showDelete: false
    })

    const [editProd, setEditProd] = useState({
        productName: "",
        barcode: "",
        quantity: 0,
        price: 0,
    })

    const [editErr, setEditErr] = useState({
        error: false,
        message: ''
    })

    const handleDelete = async (e) => {
        const target = (e == undefined)? undefined : e.target;
        getRowData(target)

        if (target != undefined && target != null) {
            if (target.id == "submit-delete") {
                const res = await (await AuthService.deleteProduct(editProd)).data;
                if (res.deleted) {
                    socket.prodSocket.send(JSON.stringify("PRODUCT_UPDATE"));
                    socket.invCapacitySocket.send(JSON.stringify("PRODUCT_UPDATE"));
                }
            }
        }

        setModal({
            showDelete: !modal.showDelete,
            showEdit: false
        })
    }

    const handleEdit = async (e) => {
        const target = (e == undefined)? undefined : e.target;
        getRowData(target)
        if (target != undefined && target != null) {
            if (target.id == "submit-edit") {
                const res = await (await AuthService.updateProduct(editProd)).data;
                if (res.updated) {
                    socket.prodSocket.send(JSON.stringify("PRODUCT_UPDATE"));
                    socket.invCapacitySocket.send(JSON.stringify("PRODUCT_UPDATE"));
                }else {
                    setEditErr({
                        error: true,
                        message: res.update_error
                    });
                    setTimeout(() => {
                        setEditErr({
                            error: false,
                            message: ""
                        });
                    }, 4000);
                }
            }
        }
        setModal({
            showDelete: false,
            showEdit: !modal.showEdit
        })
    }

    const getRowData = (button) => {
        if (button !== undefined && button !== null) {
            if (button.id == "edit" || button.id == "delete") {
                const row = button.parentElement.parentElement.children;
                setEditProd({
                    productName: row[1].innerText,
                    barcode: row[2].innerText,
                    quantity: row[3].innerText,
                    price: row[4].innerText,
                });
            }
        }
    }

    const handleInput = (e) => {
        setEditProd({
            ...editProd,
            [e.target.id] : e.target.value
        })
    }

    return (
        <div id="list-container">
            <div className='d-flex justify-content-center pe-2 ps-2 mt-3'>
                <div className='d-flex justify-content-center col-12 col-lg-11 border border-2 rounded'>
                    <div className='d-flex justify-content-center align-items-center ps-3 pe-1'>
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </div>
                    <div className='w-100'>
                        <input type="text" name="search" id="search" placeholder='Search' onChange={searchHandler} className='form-control border-0 search w-100'/>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
                <div className={`${(props.size == "full")? "table-container-full" : "table-container"} col-12 col-lg-11 pe-2 ps-2`}>
                    
                    {(editErr.error)? <Alert variant='danger' className='mt-3'>Edit Error: {editErr.message}</Alert> : null}

                    <table className="table table-striped border">
                      <thead className='table-head'>
                        <tr>
                            <th scope="col">#</th>
                            {list.title.map((title) => {
                                return (
                                    <th key={Math.random()} scope="col">{title}</th>
                                )
                            })}
                        </tr>
                      </thead>
                      <tbody>
                        
                        {(list.list.length != 0)? list.list.map((item) => {
                            count++;
                            let keys = [];
                            for (const key in item) {   
                                keys.push(key)
                            }
                            return(
                                <tr key={count}>
                                  <th scope="row">{count}</th>
                                  {keys.map((key) => {
                                    if (key != "action") {
                                        return (
                                            <th key={Math.random()} scope="row">{item[key]}</th>
                                        )
                                    }else {
                                        if (window.location.pathname != "/my-inventory" && list.isViewable) {
                                            return (
                                                <th key={Math.random()} scope="row">
                                                    <Button id={item[key]} onClick={handleView}>View</Button>
                                                </th>
                                            )
                                        }else if (window.location.pathname == "/my-inventory") {
                                            return (
                                                <th key={Math.random()} scope="row" className='d-flex'>
                                                    <button type="button" id="edit" className='me-2 btn btn-primary' onClick={handleEdit}>Edit</button>
                                                    <button type="button" id="delete" className='btn btn-danger' onClick={handleDelete}>Delete</button>
                                                </th>
                                            )
                                        }else {
                                            return (
                                                <th key={Math.random()} scope="row">No Action Available</th>
                                            )
                                        }

                                    }
                                  })}
                                </tr>
                            )
                        }) : 
                        <tr scope="row">
                          <th scope="row" colSpan={list.title.length + 1}>Found No Data to Display</th>
                        </tr>
                        }
                      </tbody>
                    </table>
                    {(list.isLoading) ? <Loading/> : null}
                    
                </div>
            </div>
            
            <Modal show={modal.showEdit} onHide={handleEdit}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Product</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Update product by using the field below</p>
                <Form>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control id="productName" onChange={handleInput} value={editProd.productName}></Form.Control>

                    <Form.Label>Barcode</Form.Label>
                    <Form.Control id="barcode" onChange={handleInput} value={editProd.barcode}></Form.Control>

                    <Form.Label>Quantity</Form.Label>
                    <Form.Control id="quantity" onChange={handleInput} value={editProd.quantity}></Form.Control>

                    <Form.Label>Price</Form.Label>
                    <Form.Control id="price" type="number" onChange={handleInput} value={editProd.price}></Form.Control>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleEdit}>
                  Close
                </Button>
                <Button variant="primary" id="submit-edit" onClick={handleEdit}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={modal.showDelete} onHide={handleDelete}>
              <Modal.Header closeButton>
                <Modal.Title>Notice!</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Are you sure you want to delete this product?</p>
                <p>Product Name: {editProd.productName}</p>
                <p>Product Barcode: {editProd.barcode}</p>
                <p>Product Quantity: {editProd.quantity}</p>
                <p>Product Price: {editProd.price}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleDelete}>
                  Close
                </Button>
                <Button variant="danger" id="submit-delete" onClick={handleDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
        </div>
    );
}