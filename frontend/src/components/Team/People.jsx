import React from "react";
import TeamCard from "./TeamCard"; 
import '../Team/Team.css';

const teamMembers = [
    { name: "person1", year:"3rd Year", branch: "CSE" },
    { name: "person2", year: "3nd Year", branch: "IT" },
];

const Team = () => {
    return (
        <div className="team-container">
            <center>
                {teamMembers.map((member, index) => (
                    <TeamCard
                        key={index}
                        name={member.name}
                        year={member.year}
                        branch={member.branch}
                    />
                ))}
            </center>
        </div>
    );
};

export default Team;
