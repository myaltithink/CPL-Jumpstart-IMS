import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function AdminOperation(){

   

    return (
        <div style={{height: '93%'}} className="d-flex justify-content-center m-2">
            <div className="col-12 border border-3 border-dark rounded text-center shadow d-flex align-items-center justify-content-center" >
                <div className="pt-4 pb-4">   
                    <h2>Operations</h2>
                    <button className="btn btn-primary col-10 m-2 pt-3 pb-3" style={{fontSize: '20px'}}>Add New User</button>
                    <button className="btn btn-primary col-10 m-2 pt-3 pb-3" style={{fontSize: '20px'}}>View User Inventory</button>
                </div>
             </div>
        </div>
    )
}