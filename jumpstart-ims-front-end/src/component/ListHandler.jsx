import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import '../assets/styles/list.css'
import AuthService from '../service/AuthService';
import Loading from './Loading';

let count = 0;
export default function ListHandler(props){

    const [list, setList] = useState({
        title: [],
        list: [],
        isLoading: true
    })

    useEffect(() => {
        const getData  = async () => {
            switch (props.list) {
                case "users":
                    const res = await (await AuthService.getUsers()).data;
                    setList({
                        list: res,
                        isLoading: false,
                        title: ["Store Name", "Address", "Contact", "Username", "Registered At"]
                    })
                    break;
            }
            return;
        }
        getData();
    }, [])

    return (
        <div id="list-container">
            <div className='d-flex justify-content-center pe-2 ps-2 mt-3'>
                <div className='d-flex justify-content-center col-12 col-lg-11 border border-2 rounded'>
                    <div className='d-flex justify-content-center align-items-center ps-3 pe-1'>
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </div>
                    <div className='w-100'>
                        <input type="text" name="search" id="search" placeholder='Search' className='form-control border-0 search w-100'/>
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
                        {list.list.map((item) => {
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
                        })}
                      </tbody>
                    </table>
                    {(list.isLoading) ? <Loading/> : null}
                    
                </div>
            </div>
        </div>
    );
}