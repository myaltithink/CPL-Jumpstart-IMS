import ContentHandler from "../component/ContentHandler";
import DashboardNav from "../component/DashboardNav";
import IMSLayout from "../component/IMSLayout";

export default function UserInventories(){

    return(
        <div style={{height: "100vh"}}>
            <IMSLayout nav={<DashboardNav user={'admin'}/>}  content={<ContentHandler/>}/>
        </div>
    )
}