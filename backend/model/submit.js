const mongoose=require('mongoose');
const SubmitSchema=new mongoose.Schema({
    name:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Join",
        required:true
    },
    quizCode:{
        type:String,
        required:true
    },
    attemptedQuestions:[{
        question:{
            type:mongoose.Schema.Types.ObjectId,ref:"Question"
        },
        choosenOption:[Number]
    }],
    score:{
        type:Number,
        default:0
    }
})
module.exports=mongoose.model("Submit",SubmitSchema);