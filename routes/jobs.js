const express = require('express')
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');

//job apply route
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

//withdraw application
router.delete('/user/:id/:jobId',async (req,res) => {
    let user;
    try{
        user = await User.findById(req.params.id);
    }
    catch(error){
        return res.redirect("/");
    }
    const appliedTo = user.appliedTo;
    let updatedJobIds = appliedTo.filter(jobId => (jobId.toString() != req.params.jobId))
    user.appliedTo = updatedJobIds;
    await user.save();
    res.redirect(`/user/${req.params.id}`)
})

//get applied jobs
router.get('/user/:id',async (req,res) => {
    let user;
    try{
        user = await User.findById(req.params.id);
    }
    catch(error){
        return res.status(500).send("Failed");
    }
    let appliedJobIds = user.appliedTo;
    let appliedJobs = []
    
    for(jobId of appliedJobIds){
        const job = await Job.findById(jobId);
        appliedJobs.push(job);
    }
    res.render('applied.ejs',{jobs: appliedJobs,user: user});
})

router.get('/job/:id', async(req,res) => {
    let job;
    try{
        job = await Job.findById(req.params.id);
    }
    catch(error){
        return res.status(500).send("Failed");
    }
    res.render('job.ejs',{job:job, user:req.user})
})

router.get('/jobs/search',async(req,res) => {
    let query = req.body.query;

    let jobs = await Job.find({});

    let searchResults = jobs.filter((job) => 
    {
        const descriptionMatch = job.description?.toLowerCase().includes(query.toLowerCase());
        const roleMatch = job.role?.toLowerCase().includes(query.toLowerCase());
        const companyMatch = job.company?.toLowerCase().includes(query.toLowerCase());

        return descriptionMatch || roleMatch || companyMatch;
    })

    return res.render('searchJobs.ejs',{user:req.user,jobs: searchResults});
})

module.exports = router;