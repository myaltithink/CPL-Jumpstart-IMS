import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import AuthService from "../service/AuthService";

export default function UserCount(){

    const [userCount, setUserCount] = useState({
        count: 0,
    })

    useEffect(() => {
        const getCount = async () => {
            const result = await (await AuthService.getUserCount()).data;
            setUserCount({count: result.userCount})
        }
        getCount()
    }, [])

    return (
        <div style={{height: '93%'}} className="d-flex justify-content-center m-2">
            <div style={{padding: '40px 80px'}} className="col-12 border border-3 border-dark rounded text-center shadow" >
                <FontAwesomeIcon style={{fontSize: '75px'}} className="mb-2" icon={faUser}/>
                <h2>Users</h2>
                <h2>{userCount.count}</h2>
                <a href="" className="text-dark">View All User</a>
            </div>
        </div>
    )
}