import { useEffect } from "react";
import ContentHandler from "../component/ContentHandler";
import DashboardNav from "../component/DashboardNav";
import IMSLayout from "../component/IMSLayout";
import { getCookie } from "../main";
import AuthService from "../service/AuthService";

export default function AdminDashboard(){

    return (
        <div>
            <IMSLayout nav={<DashboardNav user={'admin'}/>}  content={<ContentHandler/>}/>
        </div>
    );
}