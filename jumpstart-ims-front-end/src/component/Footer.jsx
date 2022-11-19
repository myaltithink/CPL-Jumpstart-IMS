import { Component } from "react";
import { Link } from "react-router-dom";
import { assets } from "../Assets";

 export default function Footer(){
    return (
        <div className="footer-basic">
            <footer>
                <h3 className="text-center mb-3">Socials</h3>
                <div className="social">
                    <Link to="#">
                        <img src={assets.facebookLogo} alt="facebook logo"/>
                    </Link>
                    <Link to="#">
                        <img src={assets.instagramLogo} alt="instagram logo"/>
                    </Link>
                    <Link to="#">
                        <img src={assets.twitterLogo} alt="twitter logo"/>
                    </Link>
                </div>
                
                <ul className="list-inline">
                   <li className="list-inline-item"><Link to="/contact-us">Contact Us</Link></li>
                   <li className="list-inline-item"><Link to="/terms-and-condition">Terms and Condition</Link></li>
               </ul>
                <p className="copyright">Jumpstart © 2022</p>
            </footer>
        </div>
    );
}
