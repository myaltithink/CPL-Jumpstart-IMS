import { useEffect } from "react";
import { Audio, Circles, ThreeDots } from "react-loader-spinner";
import { getCookie } from "../main";
import AuthService from "../service/AuthService";

export default function AuthIndex(){

    useEffect(() => {
        async function fetchData(){
            const isAdmin = await(await AuthService.isAdmin()).data;
            if (isAdmin) {
                window.location.href = "/admin-dashboard"
                return
            }
            window.location.href = "/store-dashboard"
        }
        fetchData()
    })

    return (
        <div style={{height: '95vh'}} className="d-flex align-items-center justify-content-center p-5">
            <h1 className="text-secondary me-3">Authentication Success... Proccessing</h1>
            <ThreeDots 
                height="80" 
                width="80" 
                radius="9"
                color="#4fa94d" 
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
            />
        </div>
    );
}