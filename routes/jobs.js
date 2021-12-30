const express = require('express')
const router = express.Router();
const {Job} = require('../models/Job');
const User = require('../models/User');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Jobs')

router.put('/user/:id/:jobId',async (req,res) => {
    const user = await User.findById(req.params.id);
    const appliedTo = user.appliedTo;
    const job = await Job.findById(req.params.jobId);
    const userId = req.params.id;
    if(Array.from(appliedTo).some(appliedJobId => appliedJobId==job.id)){
        return res.redirect(`/user/${userId}`);
    }
    appliedTo.push(job.id);
    const upUser = await User.findById(req.params.id);
    upUser.appliedTo  = appliedTo;
    upUser.save();
    
    res.redirect(`/user/${userId}`)
})

router.get('/user/:id',async (req,res) => {
    const user = await User.findById(req.params.id)
    let appliedJobIds = user.appliedTo;
    let appliedJobs = []

    for(jobId of appliedJobIds){
        const job = await Job.findById(jobId);
        appliedJobs.push(job);
    }
    console.log(appliedJobs);
    res.render('applied.ejs',{jobs: appliedJobs,user: user});
})


module.exports = router;