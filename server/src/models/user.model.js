import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true, 
        trim: true
    },

    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },

    avatar:{
        type: String,
        default: ""
    },
},
    {
        timestamps: true
    }
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function(password) {
        return await bcrypt.compare(password,this.password);
}


const User = mongoose.model("User",userSchema);

export {User};

