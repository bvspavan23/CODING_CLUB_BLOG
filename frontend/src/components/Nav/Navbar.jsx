import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import "../Nav/Navbar.css";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="p-5 bg-white shadow md:flex md:items-center md:justify-between z-50">
            <div className="flex justify-between items-center">
                <span className="anonymous-pro-bold text-2xl cursor-pointer pavan-papi">
                    <img className="h-10 inline logo-wrapper" src={Logo} alt="LOGO" />
                    <span>C</span><span>O</span><span>D</span><span>I</span><span>N</span><span>G</span>
                    <span> </span><span>C</span><span>L</span><span>U</span><span>B</span>
                </span>
                <span className="text-3xl cursor-pointer mx-2 md:hidden block" onClick={toggleMenu}>
                    <ion-icon name={isOpen ? "close" : "menu"}></ion-icon>
                </span>
            </div>
            <ul className={`md:flex md:items-center absolute md:static bg-white w-full md:w-auto left-0 md:opacity-100 transition-all ease-in duration-500 ${isOpen ? "top-[60px] opacity-100" : "top-[-400px] opacity-0"}`}>
                <li className="mx-4 my-6 md:my-0 bot cursor-pointer">
                    <Link to="/" onClick={closeMenu}>Home</Link>
                </li>
                <li className="mx-4 my-6 md:my-0 bot cursor-pointer">
                    <Link to="/about" onClick={closeMenu}>About Us</Link>
                </li>
                <li className="mx-4 my-6 md:my-0 bot cursor-pointer">
                    <Link to="/events" onClick={closeMenu}>Events</Link>
                </li>
                <li className="mx-4 my-6 md:my-0 bot cursor-pointer">
                    <Link to="/team" onClick={closeMenu}>Team</Link>
                </li>
                <li className="mx-4 my-6 md:my-0 bot cursor-pointer">
                    <Link to="/admin" onClick={closeMenu}>Login</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
