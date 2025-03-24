const asyncHandler = require("express-async-handler");
const EveRegistration = require("../model/eveRegistration");

const eveRegs={
  register: asyncHandler(async (req, res) => {
    const {eventid,studentname, studentemail, jntuno, studentmobile, studentyear, branch} = req.body;
    //!Validate
    if (!eventid || !studentname || !studentemail || !jntuno || !studentmobile || !studentyear || !branch) {
      throw new Error("Please all fields are required");
    }
    //!Check if user already exists
    const userExists = await EveRegistration.findOne({ studentemail });
    if (userExists) {
      throw new Error("Student already registered");
    }
    //! Create the user and save into db
    const dbUser= await EveRegistration.create({
      eventid,
      studentname,
      studentemail,
      jntuno,
      studentmobile,
      studentyear,
      branch
    });
    //! Send the response
    res.json({
      studentname: dbUser.studentname,
      studentemail: dbUser.studentemail,
      jntuno: dbUser.jntuno,
      studentmobile: dbUser.studentmobile,
      studentyear: dbUser.studentyear,
      branch: dbUser.branch
    });
  }),
  fetch: asyncHandler(async (req, res) => {
    const eveReg = await EveRegistration.find();
    res.json(eveReg);
  })
};
module.exports = eveRegs;