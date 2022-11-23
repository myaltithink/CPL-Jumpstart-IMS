
import { faArrowRightFromBracket, faBoxesStacked, faChartLine, faHandHoldingDollar, faList, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'

export default function DashboardNav(props){

    useEffect(() => {
        function applySelected(){
            let selected = "";
            const urlPaths = window.location.pathname.split('/')
            if (urlPaths.length > 2) {
                selected = urlPaths[2]
            }else {
                selected = urlPaths[1]
            }
            const nav = document.getElementsByClassName(selected)[0];
            nav.classList.add('selected')
        }
        applySelected();
    }, [])

    return (
        <div>
            {(props.user == 'admin')? 
                <div id='nav-content' className='admin-nav'>
                    <a href="/admin-dashboard" className="d-block admin-dashboard"><FontAwesomeIcon icon={faChartLine}/> Dashboard</a>
                    <a href="/user-inventories" className="d-block user-inventories user-inventory"><FontAwesomeIcon icon={faBoxesStacked}/> User Inventories</a>
                    <a href="/logout" className="d-block bottom col-4 col-lg-3"><FontAwesomeIcon icon={faArrowRightFromBracket}/> Sign out</a>
                </div>
            :
                <div id='nav-content' className='user-nav'>
                    <a href="/store-dashboard" className="d-block store-dashboard"><FontAwesomeIcon icon={faChartLine}/> Dashboard</a>
                    <a href="/my-inventory" className="d-block my-inventory"><FontAwesomeIcon icon={faBoxesStacked}/> Inventory</a>
                    <a href="/sale-records/record-list" className="d-block record-list sale-record"><FontAwesomeIcon icon={faHandHoldingDollar}/> Sales</a>
                    <a href="/sale-records" className="d-block sale-records"><FontAwesomeIcon icon={faList}/> Sale List</a>
                    <a href="/logout" className="d-block bottom col-4 col-lg-3"><FontAwesomeIcon icon={faArrowRightFromBracket}/> Sign out</a>
                </div>
            }
        </div>
    )
}