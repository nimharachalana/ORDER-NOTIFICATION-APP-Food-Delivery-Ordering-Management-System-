import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';


function Footer() {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" />
                <p>Fresh, delicious meals delivered right to your door.We bring you a wide variety of dishes made with authentic recipes,high-quality ingredients, and a touch of love.Order now and enjoy restaurant-style flavors from the comfort of your home.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+94 70 4039 411</li>
                    <li>cantecshop@gmail.com</li>
                </ul>
            </div>

        </div>
        <hr />
        <p className="footer-copyright">© 2026 Food Delivery. All rights reserved.</p>
    </div>
  );
}

export default Footer;
