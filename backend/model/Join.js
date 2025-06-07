const mongoose=require('mongoose');
const JoinSchema=new mongoose.Schema({
    name:{
        type:String,
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
    },
    isSubmitted:{
        type:Boolean,
        default:false
    },

},
{
    timestamps:true
}
)
module.exports=mongoose.model("Join",JoinSchema);