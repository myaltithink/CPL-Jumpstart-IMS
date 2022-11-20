import { useEffect } from "react"
import { ThreeDots } from "react-loader-spinner";

export default function Logout(){

    useEffect(()  => {
        function logout(){
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            window.location.href = '/'
        }
        logout();
    })

    return(
        <div style={{height: '95vh'}} className="d-flex align-items-center justify-content-center p-5">
            <h1 className="text-secondary me-3">Loging Out</h1>
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
    )
}