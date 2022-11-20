import { faHand } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function Denied(){

    return (
        <div style={{height: '90vh'}} className="d-flex align-items-center justify-content-center p-5">
            <div>
                <h1 className="text-secondary text-center"><FontAwesomeIcon icon={faHand}/> STOP <br /> Permission Denied...</h1>
                <Link to="/auth" className="btn btn-primary w-100 mt-4">Go Back</Link>
            </div>
        </div>
    );
}