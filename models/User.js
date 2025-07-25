import mongoose from "mongoose";


const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    emailVerified:{
        type: Boolean,
        default:false
    },
    mobile:{
        type:Number,
        unique:true,
    },
    mobileVerified:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://i.pinimg.com/736x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg"
    },
    isOnline:{
        type:Boolean,
        default:false,
    },
    lastSeen:{
        type:Date,
        default:Date.now()
    }

},{timestamps:true});

const User = mongoose.model("User",userSchema);
export default User;