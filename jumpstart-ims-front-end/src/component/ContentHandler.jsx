import AdminOperation from "./AdminOperation";
import InventoryCapacity from "./InventoryCapacity";
import SaleOfTheMonth from "./SaleOfTheMonth";
import UserCount from "./UserCount";

export default function ContentHandler(props){

    return (
        <div>
            <UserCount/>
            <AdminOperation/>
            <InventoryCapacity/>
            <SaleOfTheMonth/>
        </div>
    )

}