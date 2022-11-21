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
        <div style={{height: '93%'}} className="d-flex justify-content-center align-items-center m-3">
            <div style={{padding: '40px 80px'}} className="d-flex align-items-center justify-content-center col-12 h-100 border border-3 border-dark rounded text-center shadow" >
                <div>
                    <h3>Total Sale of {saleOfTheMonth.month}</h3>
                    <h4>${saleOfTheMonth.total}</h4>
                    <button type="button" className="btn"><a href="" className="text-dark">View Sale Record </a></button>
                </div>
             </div>
        </div>
    )
}