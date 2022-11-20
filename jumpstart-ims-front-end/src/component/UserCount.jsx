import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function UserCount(){

    const [userCount, setUserCount] = useState({
        count: 123,
    })

    return (
        <div className="d-flex justify-content-center">
            <div style={{padding: '40px 80px'}} className="col-12 border border-3 border-dark rounded text-center shadow" >
                <FontAwesomeIcon style={{fontSize: '75px'}} className="mb-2" icon={faUser}/>
                <h2>Users</h2>
                <h2>{userCount.count}</h2>
                <a href="" className="text-dark">View All User</a>
            </div>
        </div>
    )
}