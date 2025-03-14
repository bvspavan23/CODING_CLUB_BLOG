const mongoose = require("mongoose");
const EventSchema=new mongoose.Schema(
  {
    eventname: {
      type: String,
      required: true,
      unique: true,
    },
    eventid: {
      type: String,
      required: true,
    },
    startdate: {
      type: Date,
      required: true
    },
    starttime: {
      type: String,
      required: true
    },
    enddate: {
      type: Date,
      required: true
    },
    endtime: {
      type: String,
      required: true
    },
    venue: {
      type: String,
    },
    description: {
      type:String
    },
    eligibility:{
      type: String,
      required: true
    },
    image:{
      url:{
        type: String,
        required: true
      },
      public_id:{
        type:String,
        required:true
      }
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("EveDetails",EventSchema);