import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

export default function SaleOfTheMonth(){

    const [saleOfTheMonth, setSaleOfTheMonth] = useState({
        month: 'November',
        total: '123123'
    })

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div style={{padding: '40px 80px'}} className="col-12 border border-3 border-dark rounded text-center shadow" >
                <h3>Total Sale of {saleOfTheMonth.month}</h3>
                <h4>${saleOfTheMonth.total}</h4>
                <button type="button" className="btn"><a href="" className="text-dark">Update Max Inventory</a></button>
             </div>
        </div>
    )
}