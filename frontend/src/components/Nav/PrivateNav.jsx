import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../../assets/Logo.png';
import '../Nav/Navbar.css';
import { useDispatch} from "react-redux";
import { logoutAction } from "../../redux/slice/authSlice";

const PrivateNav = () => {
    const navigate = useNavigate();
    const dispatch=useDispatch();

    // Handle logout function
    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        dispatch(logoutAction());  
        navigate("/admin");
    };

    return (
        <nav className="p-5 bg-white shadow md:flex md:items-center md:justify-between z-50">
            <div className="flex justify-between items-center ">
                <span className="anonymous-pro-bold text-2xl cursor-pointer pavan-papi">
                    <img className="h-10 inline logo-wrapper" src={Logo} alt="LOGO" />
                    <span>C</span><span>O</span><span>D</span><span>I</span><span>N</span><span>G</span><span> </span><span>C</span><span>L</span><span>U</span><span>B</span>
                </span>
                <span className="text-3xl cursor-pointer mx-2 md:hidden block">
                    <ion-icon name="menu" onclick="Menu(this)"></ion-icon>
                </span>
            </div>
            <ul
                className="md:flex md:items-center z-[1] md:z-[1] md:static absolute bg-white w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 opacity-0 top-[-400px] transition-all ease-in duration-500">
                <li className="mx-4 my-6 md:my-0 bot cursor-pointer">
                    <Link to="/edit/add/eve">Add Event</Link>
                </li>
                
                <li className="mx-4 my-6 md:my-0 bot cursor-pointer">
                    <Link to="/edit/botpapi/list/events">Events</Link>
                </li>

                {/* <li className="mx-4 my-6 md:my-0 bot cursor-pointer">
                    <Link to="/edit/del/eve">Delete Event</Link>
                </li> */}
                {/* <li className="mx-4 my-6 md:my-0 bot cursor-pointer">
                    <Link to="/event/eventinfo/:title/:id">Update Event</Link>
                </li> */}
                <li className="mx-4 my-6 md:my-0 bot cursor-pointer">
                    <button onClick={handleLogout} className="bg-transparent border-none cursor-pointer">
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
};
export default PrivateNav;
