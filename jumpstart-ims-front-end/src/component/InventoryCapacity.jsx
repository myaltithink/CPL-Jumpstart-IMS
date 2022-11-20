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
        <div className="d-flex justify-content-center">
            <div style={{padding: '40px 80px'}} className="col-12 border border-3 border-dark rounded text-center shadow" >
                <div className='d-flex justify-content-center mb-3'>
                    <div style={{height: '100px', width: '100px'}}>
                        <CircularProgressbar value={inventory.percent} text={`${inventory.percent}%`}/>
                    </div>
                </div>
                <h3>Inventory Capacity</h3>
                <h4>{inventory.items} / {inventory.max}</h4>
                <button type="button" className="btn"><a href="" className="text-dark">Update Max Inventory</a></button>
                
             </div>
        </div>
    )
}