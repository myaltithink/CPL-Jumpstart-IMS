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
            : null }

            {(window.location.pathname.includes("/store-dashboard"))? 
                <div>
                    <div>
                        <div className="d-flex justify-content-center">
                            <div className="col-12 col-lg-11 top-module pt-2 d-block d-lg-flex justify-content-evenly">
                                <div className="w-100"><InventoryCapacity/></div>
                                <div className="w-100"><SaleOfTheMonth/></div>

                            </div>
                        </div>
                    </div>
                    <ListHandler list="products"/>
                </div>
            : null}

            {(window.location.pathname.includes('/my-inventory'))? 
                <div>
                    <div>
                        <div className="d-flex justify-content-center">
                            <div className="col-12 col-lg-11 top-module pt-2 d-block d-lg-flex justify-content-evenly">
                                <div className="w-100"><InventoryCapacity/></div>
                            </div>
                        </div>
                    </div>
                    <ListHandler list="products"/>
                </div>
            : null}

            {(window.location.pathname.includes('/user-inventories'))? 
                <div>
                    <ListHandler list="inventories" size="full"/>
                </div>
            : null}

            {(window.location.pathname.includes('/view/user-inventory'))? 
                <div>
                    <div>
                        <div className="d-flex justify-content-center">
                            <div className="col-12 col-lg-11 top-module pt-2 d-block d-lg-flex justify-content-evenly">
                                <div className="w-100"><InventoryCapacity view="admin"/></div>
                            </div>
                        </div>
                    </div>
                    <ListHandler list="user-inventory"/>
                </div>
            : null}

            {(window.location.pathname == '/sale-records')? 
                <div>
                    <ListHandler list="sale-records" size="full"/>
                </div>
            : null}

            {(window.location.pathname.includes('/view/sale-record'))? 
                <div>
                    <div>
                        <div className="d-flex justify-content-center">
                            <div className="col-12 col-lg-11 top-module pt-2 d-block d-lg-flex justify-content-evenly">
                                <div className="w-100"><SaleOfTheMonth view="user"/></div>
                            </div>
                        </div>
                    </div>
                    <ListHandler list="sales-of"/>
                </div>
            : null}

            {(window.location.pathname.includes('/sale-records/record-list'))? 
                <div>
                    <div>
                        <div className="d-flex justify-content-center">
                            <div className="col-12 col-lg-11 top-module pt-2 d-block d-lg-flex justify-content-evenly">
                                <div className="w-100"><SaleOfTheMonth view="user"/></div>
                            </div>
                        </div>
                    </div>
                    <ListHandler list=""/>
                </div>
            : null}

            
        </div>
    )

}