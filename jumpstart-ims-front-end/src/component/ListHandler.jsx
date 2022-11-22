import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import '../assets/styles/list.css'
import AuthService, { connectToWS } from '../service/AuthService';
import Loading from './Loading';

let count = 0;

export default function ListHandler(props){

    const [list, setList] = useState({
        title: [],
        list: [],
        originalList: [],
        isLoading: true
    })

    const [socket, setSocket] = useState({
        userSocket: null,
        prodSocket: null,
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
            }
        }

        const userWS = connectToWS("/admin-dashboard/update");

        
        userWS.addEventListener('open', () => {
            console.log("list handler has connected to user websocket")
        })
        
        userWS.addEventListener('message', (message) => {
            getData();
        })

        const prodWS = connectToWS("/user/inventory/product/update");
        
        prodWS.addEventListener('open', () => {
            console.log("list handler has connected to product websocket")
        })
        
        prodWS.addEventListener('message', (message) => {
            console.log(message)
            getData();
        })

        setSocket({
            userSocket: userWS,
            prodSocket: prodWS
        })
        getData();
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
                <div className="table-container col-12 col-lg-11 pe-2 ps-2">
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
                                    return (
                                        <th key={Math.random()} scope="row">{item[key]}</th>
                                    )
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