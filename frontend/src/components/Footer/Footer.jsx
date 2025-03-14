import React from 'react'
import './Footer.css'
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
const Footer = () => {
  return (
    <div className="footer">
    <h3>Coding Club</h3>
    <div className="social-links">
      <a href="https://www.facebook.com/"><FaFacebook /></a>
      <a href="https://twitter.com"><FaXTwitter /></a>
      <a href="https://www.instagram.com"><FaInstagram /></a>
      <a href="https://www.whatsapp.com"><FaWhatsapp /></a>
    </div>
  </div>
  )
}
export default Footer;
