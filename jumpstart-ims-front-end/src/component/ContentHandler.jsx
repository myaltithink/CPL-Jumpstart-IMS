import AdminOperation from "./AdminOperation";
import InventoryCapacity from "./InventoryCapacity";
import ListHandler from "./ListHandler";
import SaleOfTheMonth from "./SaleOfTheMonth";
import UserCount from "./UserCount";
import '../assets/styles/top_module.css'

export default function ContentHandler(props){

    return (
        <div>
            {(window.location.pathname.includes('/admin-dashboard'))? 
                <div>
                    <div>
                        <div className="d-flex justify-content-center">
                            <div className="col-12 col-lg-11 top-module pt-2 d-block d-lg-flex justify-content-evenly">
                                <div className="w-100"><UserCount/></div>
                                <div className="w-100"><AdminOperation/></div>

                            </div>
                        </div>
                    </div>
                    <ListHandler list="users"/>
                </div>
            : 
                <div>
                    <div>
                        <div className="d-flex justify-content-center">
                            <div className="col-12 col-lg-11 top-module pt-2 d-block d-lg-flex justify-content-evenly">
                                <div className="w-100"><InventoryCapacity/></div>
                                <div className="w-100"><SaleOfTheMonth/></div>

                            </div>
                        </div>
                    </div>
                    <ListHandler/>
                </div>
            }
        </div>
    )

}