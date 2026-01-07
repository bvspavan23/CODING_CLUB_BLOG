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
    team: [{
      studentname: {
        type: String,
        required: true,
      },
      studentemail: {
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
    }],
    payment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("EveRegistration",EveRegistrationSchema);