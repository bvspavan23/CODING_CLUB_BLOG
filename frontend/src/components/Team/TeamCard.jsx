import React from "react";
import '../Team/Team.css';
import profile from '../../assets/profile.png';

const TeamCard = ({ name, year, branch }) => {
    return (
        <div className="card">
            <div className="cardimg">
                <img src={profile} alt="Profile" />
                <div className="overlay"></div>
            </div>
            <div className="content">
                {name}<br />
                {year}<br />
                {branch}
            </div>
            <div className="links">
                <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-facebook"></i>
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-linkedin"></i>
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-twitter"></i>
                </a>
            </div>
        </div>
    );
};

export default TeamCard;
