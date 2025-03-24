const mongoose = require("mongoose");
const EveRegistrationSchema=new mongoose.Schema(
  {
    eventid: {
      type: String,
      required: true,
    },
    studentemail: {
      type: String,
      required: true,
      unique: true,
    },
    studentname: {
      type: String,
      required: true,
    },
    jntuno: {
      type: String,
      required: true,
    },
    studentmobile: {
      type: String,
      required: true,
    },
    studentyear: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("EveRegistration",EveRegistrationSchema);