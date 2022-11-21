import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

export default function InventoryCapacity(){

    const [inventory, setInventory] = useState({
        items: 34,
        max: 100,
        percent: 34
    });
   

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
                    <button type="button" className="btn"><a href="" className="text-dark">Update Max Inventory</a></button>
                </div>
             </div>
        </div>
    )
}