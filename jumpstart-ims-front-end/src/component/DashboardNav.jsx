
import { faArrowRightFromBracket, faBoxesStacked, faChartLine, faHandHoldingDollar, faList, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'

export default function DashboardNav(props){

    useEffect(() => {
        function applySelected(){
            const selected = window.location.pathname.split('/')[1]
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
                    <a href="" className="d-block user-inventories"><FontAwesomeIcon icon={faBoxesStacked}/> User Inventories</a>
                    <a href="/logout" className="d-block bottom col-4 col-lg-3"><FontAwesomeIcon icon={faArrowRightFromBracket}/> Sign out</a>
                </div>
            :
                <div id='nav-content' className='user-nav'>
                    <a href="/store-dashboard" className="d-block store-dashboard"><FontAwesomeIcon icon={faChartLine}/> Dashboard</a>
                    <a href="/my-inventory" className="d-block my-inventory"><FontAwesomeIcon icon={faBoxesStacked}/> Inventory</a>
                    <a href="" className="d-block sales"><FontAwesomeIcon icon={faHandHoldingDollar}/> Sales</a>
                    <a href="" className="d-block sale-list"><FontAwesomeIcon icon={faList}/> Sale List</a>
                    <a href="/logout" className="d-block bottom col-4 col-lg-3"><FontAwesomeIcon icon={faArrowRightFromBracket}/> Sign out</a>
                </div>
            }
        </div>
    )
}