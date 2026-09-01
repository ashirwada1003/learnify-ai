const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        //enum restricts to a fixed set of allowed values.
        //enum restricts it to only the specific values you list — ["student", "instructor", "admin"] — nothing else is allowed to be saved.
        enum:["student","instructor","admin"],
        default:"student",
    },
},{timestamps:true});

const userModel = mongoose.model("User",userSchema);

module.exports = userModel;

// The important addition — why register ignores client-sent role: You explained why default is student well, but there's a second, distinct reason we specifically made register refuse to accept role from the client at all, even though the schema technically allows "instructor" or "admin" as valid enum values. Think about it this way: if register blindly did userModel.create({ name, email, password, role }) using whatever role came from req.body, then anyone hitting your API directly (like via Postman) could send role: "admin" and instantly become an admin — since "admin" is a perfectly valid enum value, MongoDB would happily save it. The enum protects against garbage/typo values, but it does nothing to stop someone from legitimately choosing "admin" for themselves. That's why we removed role from what register accepts entirely — relying on the schema's default: "student" to kick in instead, so registration can only ever create students, no matter what the client sends...