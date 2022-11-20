import { useEffect } from "react";
import { getCookie } from "../main";
import AuthService from "../service/AuthService";

export default function AdminDashboard(){

    return (
        <div style={{height: '95vh'}} className="d-flex align-items-center justify-content-center p-5">
            <h1 className="text-secondary">Admin Dashboard</h1>
        </div>
    );
}