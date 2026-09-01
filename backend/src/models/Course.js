const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,//this id refers to which user
        ref:"User", 
        required:true,
    },
    price:{
        type:Number,
        default:0,
    },
    thumbnail:{
        type:String
    }
},{timestamps:true});

const courseModel = mongoose.model("Courses",courseSchema);

module.exports = courseModel;


// why  type:mongoose.Schema.Types.ObjectId, ref:"User"

// In the Users collection:
// { "_id": "abc123", "name": "Ravi", "role": "instructor" }

// In the Courses collection:
// { "_id": "xyz789", "title": "React Basics", "instructor": "abc123" }

// See that? "instructor": "abc123" is literally copy-pasted from "_id": "abc123" above it. That's the entire mechanism — a course just remembers "the id of the person who made me," nothing more magical than that.

// mongoose.Schema.Types.ObjectId = "this field will hold one of those _id values" (like "abc123")
// ref: "User" = "and that _id specifically belongs to a document sitting in the Users collection" (so we know where to go look it up later)