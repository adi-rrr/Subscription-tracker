import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{type:String,
        required:[true,"Name is required"],
        trim : true,
        minLength : 2,
        maxLength : 50
    }, //error message is the second parameter
    email:{
        type:String,
        required:[true,"Email is required"],
        trim : true,
        unique:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength : 6,
        maxLength : 100
    },

}, {timestamps:true}); //timestamps:true will add createdAt and updatedAt fields

const User = mongoose.model("User",userSchema);
export default User;