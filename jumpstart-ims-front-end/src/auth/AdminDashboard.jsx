import axios from "axios";
import { useEffect } from "react";
import { API } from "../Assets";
import ContentHandler from "../component/ContentHandler";
import DashboardNav from "../component/DashboardNav";
import IMSLayout from "../component/IMSLayout";
import { getCookie } from "../main";
import AuthService from "../service/AuthService";

export default function AdminDashboard(){

  

    return (
        <div style={{height: '100vh'}}>
            <IMSLayout nav={<DashboardNav user={'admin'}/>}  content={<ContentHandler/>}/>
        </div>
    );
}