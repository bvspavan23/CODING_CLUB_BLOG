import React from "react";
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";
import '../Team/Team.css';
import defaultProfile from '../../assets/profile.png';

const TeamCard = ({ 
    name, 
    year, 
    branch,
    profile = defaultProfile,
    portfolio = "https://www.portfolio.in",
    instagram = "https://www.instagram.com",
    facebook = "https://www.facebook.com",
    linkedin = "https://www.linkedin.com",
    twitter = "https://www.twitter.com"
}) => {
    return (
        <div className="card">
            <div className="cardimg">
                <img src={profile} alt={`${name}'s profile`} />
                <div className="overlay"></div>
            </div>
            <div className="content">
                <h3>{name}</h3>
                <p>{year}</p>
                <p>{branch}</p>
            </div>
            <div className="links">
                <a href={portfolio} target="_blank" rel="noopener noreferrer">
                    <FaGlobe />
                </a>
                <a href={instagram} target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                </a>
                <a href={facebook} target="_blank" rel="noopener noreferrer">
                    <FaFacebook />
                </a>
                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                </a>
                <a href={twitter} target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                </a>
            </div>
        </div>
    );
};

export default TeamCard;