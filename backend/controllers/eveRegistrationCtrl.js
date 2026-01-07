const asyncHandler = require("express-async-handler");
const EveRegistration = require("../model/eveRegistration");
const Evedetails = require("../model/AddEvent");

const eveRegs={
  register: asyncHandler(async (req, res) => {
    const {eventid, studentname, studentemail, jntuno, studentmobile, studentyear, branch, team, payment} = req.body;
    
    //! Get event details to check if it's a team event
    const eventDetails = await Evedetails.findOne({ eventid });
    if (!eventDetails) {
      throw new Error("Event not found");
    }

    //!Validate basic fields
    if (!eventid || !studentname || !studentemail || !jntuno || !studentmobile || !studentyear || !branch) {
      throw new Error("Please all fields are required");
    }

    //! If it's a team event, validate team members
    if (eventDetails.isTeam) {
      if (!team || !Array.isArray(team) || team.length === 0) {
        throw new Error("Team members are required for team events");
      }
      
      if (team.length !== eventDetails.numberTeamSize) {
        throw new Error(`Team size must be exactly ${eventDetails.numberTeamSize} members`);
      }

      // Validate each team member
      for (let i = 0; i < team.length; i++) {
        const member = team[i];
        if (!member.studentname || !member.studentemail || !member.jntuno || 
            !member.studentmobile || !member.studentyear || !member.branch) {
          throw new Error(`All fields are required for team member ${i + 1}`);
        }
      }

      // Check if any team member is already registered for this event
      for (const member of team) {
        const memberExists = await EveRegistration.findOne({ 
          eventid, 
          $or: [
            { studentemail: member.studentemail },
            { "team.studentemail": member.studentemail }
          ]
        });
        if (memberExists) {
          throw new Error(`Student ${member.studentemail} is already registered for this event`);
        }
      }
    } else {
      // For non-team events, check if the main student is already registered
      const userExists = await EveRegistration.findOne({ eventid, studentemail });
      if (userExists) {
        throw new Error("Student already registered for this event");
      }
    }

    //! Create the registration and save into db
    const registrationData = {
      eventid,
      studentname,
      studentemail,
      jntuno,
      studentmobile,
      studentyear,
      branch,
      payment: payment || false
    };

    // Add team members if it's a team event
    if (eventDetails.isTeam) {
      registrationData.team = team;
    }

    const dbUser = await EveRegistration.create(registrationData);
    
    //! Send the response
    res.json({
      studentname: dbUser.studentname,
      studentemail: dbUser.studentemail,
      jntuno: dbUser.jntuno,
      studentmobile: dbUser.studentmobile,
      studentyear: dbUser.studentyear,
      branch: dbUser.branch,
      team: dbUser.team,
      payment: dbUser.payment
    });
  }),
  fetch: asyncHandler(async (req, res) => {
    const eveReg = await EveRegistration.find();
    res.json(eveReg);
  }),
  
  getEventDetails: asyncHandler(async (req, res) => {
    const { eventid } = req.params;
    const eventDetails = await Evedetails.findOne({ eventid });
    if (!eventDetails) {
      throw new Error("Event not found");
    }
    res.json({
      eventname: eventDetails.eventname,
      isTeam: eventDetails.isTeam,
      numberTeamSize: eventDetails.numberTeamSize,
      eligibility: eventDetails.eligibility
    });
  })
};
module.exports = eveRegs;