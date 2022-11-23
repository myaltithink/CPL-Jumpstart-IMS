import ContentHandler from "../component/ContentHandler";
import DashboardNav from "../component/DashboardNav";
import IMSLayout from "../component/IMSLayout";

export default function SaleRecords(){

    return(
        <div style={{height: "100vh"}}>
            <IMSLayout nav={<DashboardNav user={'store'}/>} content={<ContentHandler/>}/>
        </div>
    )
}