const mongoose = require('mongoose');
const {jobSchema} = require('./Job');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    appliedTo: [mongoose.Schema.Types.ObjectId]
       
})

const User = mongoose.model("User",userSchema);
module.exports = User;
