import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function AdminOperation(){

   

    return (
        <div className="d-flex justify-content-center">
            <div style={{padding: '40px 80px'}} className="col-12 border border-3 border-dark rounded text-center shadow" >
                <h2>Operations</h2>
                <button className="btn btn-primary w-100 m-2 pt-3 pb-3" style={{fontSize: '20px'}}>Add New User</button>
                <button className="btn btn-primary w-100 m-2 pt-3 pb-3" style={{fontSize: '20px'}}>View User Inventory</button>
            </div>
        </div>
    )
}