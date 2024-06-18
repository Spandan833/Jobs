const mongoose = require('mongoose');

let jobSchema = new mongoose.Schema({
    role:{
        type: String,
        required: true
    },
    company:{
        type: String,
        required: true
    },
    salary:{
        type: Number,
        required: true
    },
    postedOn:{
        type: Date
    },
    description:{
        type: String,
        required: false
    },
    featured:{
        type: Boolean,
        required: false
    }

})

const Job = mongoose.model("job", jobSchema);
module.exports = Job;