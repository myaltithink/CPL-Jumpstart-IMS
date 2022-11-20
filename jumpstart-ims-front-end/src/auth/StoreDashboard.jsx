import { useEffect } from "react";
import DashboardNav from "../component/DashboardNav";
import IMSLayout from "../component/IMSLayout";
import { getCookie } from "../main";
import AuthService from "../service/AuthService";

export default function StoreDashboard(){

    return (
        <div style={{height: "100vh"}}>
            <IMSLayout nav={<DashboardNav user={'store'}/>}/>
        </div>
    );
}