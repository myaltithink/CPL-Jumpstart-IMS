import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import '../assets/styles/list.css'
import AuthService, { connectToWS } from '../service/AuthService';
import Loading from './Loading';


export default function ListHandler(props){

    const [list, setList] = useState({
        title: [],
        list: [],
        originalList: [],
        isLoading: true
    })

    let count = 0;

    const [socket, setSocket] = useState({
        userSocket: null,
        prodSocket: null,
        inventories: null,
        salesSocket: null,
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
                        title: ["Store Name", "Address", "Contact", "Username", "Registered At"]
                    })
                break;

                case "products":
                    const prodRes = await (await AuthService.getProducts()).data;
                    setList({
                        originalList: prodRes,
                        list: prodRes,
                        isLoading: false,
                        title: ["Product Name", "Barcode", "Quantity", "Price", "Updated At"]
                    })
                break;

                case "inventories": 
                    const inventories = await (await AuthService.getInventories()).data;
                    setList({
                        originalList: inventories,
                        list: inventories,
                        isLoading: false,
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
                        title: ["Product Name", "Barcode", "Quantity", "Price", "Updated At"]
                    })
                break;

                case "sale-records":
                    const saleRecords = await (await AuthService.getStoreSaleRecords()).data;
                    setList({
                        originalList: saleRecords,
                        list: saleRecords,
                        isLoading: false,
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
                        title: ["Product Name", "Quantity", "Price", "Total", "Soldt At"]
                    })
                break;
            }
        }

        let userWS = null;
        let prodWS = null;
        let invWS = null;
        let saleWS = null;

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
            
            if (pathname.includes('/store-dashboard') || pathname.includes('/my-inventory') ||pathname.includes("/view/user-inventory")) {
                prodWS = connectToWS("/user/inventory/product/update");
                
                prodWS.addEventListener('open', () => { 
                    console.log("list handler has connected to product websocket")
                })
                
                prodWS.addEventListener('message', (message) => {
                    getData();
                })
            }

            if (pathname.includes("/sale-records")) {
                saleWS = connectToWS("/sales/update");

                saleWS.addEventListener("open", () => {
                    console.log("list handler is now listening for sales update");
                })

                saleWS.addEventListener("message", (message) => {
                    getData();
                });
            }
        }


        setSocket({
            userSocket: userWS,
            prodSocket: prodWS,
            inventories: invWS,
            salesSocket: saleWS
        })
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
                                        return (
                                            <th key={Math.random()} scope="row">
                                                <Button id={item[key]} onClick={handleView}>View</Button>
                                            </th>
                                        )
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
        </div>
    );
}