import React from "react";
import TeamCard from "./TeamCard"; 
import '../Team/Team.css';
import { Linkedin } from "lucide-react";

const teamMembers = [
    { name: "Pavan", year:"4th Year", branch: "CSE",profile:"https://res.cloudinary.com/dwb8m6n0y/image/upload/Team/Pavan_rlqrcw.png",portfolio:"https://pavan-portfolio-drab.vercel.app",instagram:"https://www.instagram.com/pavan_23_04/",linkedin:"https://www.linkedin.com/in/bvs-pavan-369752289/"},
    { name: "Yoshitha", year:"4th Year", branch: "CSE-AIDS",profile:"https://res.cloudinary.com/dwb8m6n0y/image/upload/Team/Yoshitha_p157et.jpg",instagram:"",linkedin:""},
    { name: "Bhavana", year:"4th Year", branch: "CSE-AIML",profile:"https://res.cloudinary.com/dwb8m6n0y/image/upload/Team/Bhavana_uuatce.png",instagram:"",linkedin:""},
    { name: "Durga Prasad", year:"4th Year", branch: "CSE-AIDS",profile:"https://res.cloudinary.com/dwb8m6n0y/image/upload/Team/Durga_Prasad_gwl19i.jpg",instagram:"",linkedin:""},
    { name: "Youva Sri", year:"4th Year", branch: "CSE",profile:"https://res.cloudinary.com/dwb8m6n0y/image/upload/Team/Youva_Sri_x4jf2a.jpg",instagram:"",linkedin:""},
];

const Team = () => {
    return (
        <div className="team-container">
            {/* <center> */}
                {teamMembers.map((member, index) => (
                    <TeamCard
                        key={index}
                        name={member.name}
                        year={member.year}
                        branch={member.branch}
                        profile={member.profile}
                        portfolio={member.portfolio}
                        instagram={member.instagram}
                        linkedin={member.linkedin}
                    />
                ))}
            {/* </center> */}
        </div>
    );
};

export default Team;
