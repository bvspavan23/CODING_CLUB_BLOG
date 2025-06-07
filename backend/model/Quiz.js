const mongoose = require("mongoose");
const QuizSchema=new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    startdate: {
      type: Date,
      required: true,
    },
    enddate: {
      type: Date,
      required: true,
    },
    starttime: {
      type: String,
      required: true,
    },
    endtime: {
      type: String,
      required: true,
    },
    quizcode:{
      type: String,
      required: true,
      unique: true
    },
    maxpoints:{
      type: Number,
      required: true
    },
    isRealtime:{
      type: Boolean,
      default: false
    },
    questions:[{type:mongoose.Schema.Types.ObjectId,ref:"Question"}],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Quiz",QuizSchema);