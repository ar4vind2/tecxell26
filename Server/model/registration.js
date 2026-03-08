import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
    eventName:{
        type:String,
        required:true,
        enum: ['Vibe Coding', 'Reel Making', 'Poster Making', 'Computer Quiz', 'Mini Miltia', 'Treasure Hunt', 'E-football'],
    },
    playerName:{
        type: [String],
        required:true
    },
    teamName:{
        type:String,
    },
    phone:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    college:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true
    },
    transactionId:{
        type:String,
        required:true
    },
    squadSize:{
        type:Number,
        required:true,
        default:1
    },
    verified:{
        type:String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default:'Pending'
    },
    feeSts:{
        type:String,
        enum: ['Pending', 'Paid'],
        default:'Pending'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;