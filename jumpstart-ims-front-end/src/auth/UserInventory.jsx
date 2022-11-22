import ContentHandler from "../component/ContentHandler";
import DashboardNav from "../component/DashboardNav";
import IMSLayout from "../component/IMSLayout";

export default function UserInventory(){
    
    return(
        <div style={{height: "100vh"}}>
            <IMSLayout nav={<DashboardNav user={'user'}/>}  content={<ContentHandler/>}/>
        </div>
    )
}