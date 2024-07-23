const express = require('express');
const User = require('../models/userModel');
//const AppError = require('../utils/appError');
const router = express.Router();


router.post('/signup', async (req,res,next)=>{
    const user = await User.create(req.body)
    
    req.session.user = user;
    req.session.save();
    res.status(200).redirect('/home');
 });

router.post('/login', async(req,res,next)=>{
    const { email, password } = req.body;

    //CHECK IF EMAIL/PASSWORD IS CORRECT
    if (!email || !password) {
        return next(new AppError('Please provide email and password'), 400);
    }

    //CHECK IF USER EXISTS AND PASSWORD IS CORRECT
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        res.status(401).json({
            status: 'failed',
            message: "Wrong email or password"
        });
    }else if(user.role == 'user'){
        req.session.user = user;
        req.session.save();
        res.status(200).redirect('/home');
    }else{
        req.session.user = user;
        req.session.save(); 
        res.status(200).redirect('/dashboard');
    };
});

router.get('/signout', (req,res,next)=>{
    req.session.destroy();
    res.redirect('/')
});

router.post('/cancel/:id', async(req,res,next)=>{
    const user = req.session.user;
    if(!user){
        res.status(401).redirect('/');
    }else if(user.role == 'user'){
        res.status(401).redirect('/home');
    }else{
        const member = await User.findByIdAndDelete(req.params.id);
        //const unreturnedBooks = await BookItem.deleteMany({"user._id":req.params.id, status:"issued"});
        res.status(200).redirect('/members');
    }
});


router.get('/home',async (req,res,next)=>{
    const user = req.session.user;
    if(!user){
        res.status(401).redirect('/');
    }else{ res.status(200).render('home', {data:{user}}); }
});

router.get('/me', (req,res,next)=>{
    const user = req.session.user;
    if(!user){
        res.status(401).redirect('/');
    }else{ res.status(200).render('profile', {data:{user}}); }
});

router.post('/update',async (req,res,next)=>{
    const user = req.session.user;
    if(!user){
        res.status(401).redirect('/');
    }else{ 
        const update = {
            firstName: (req.body.firstName=='') ? user.firstName : req.body.firstName,
            lastName: (req.body.lastName=='') ? user.lastName : req.body.lastName,
            email: (req.body.email=='') ? user.email : req.body.email
        }
        const profile = await User.findByIdAndUpdate(user._id, update, {new:true});
        req.session.user = profile;
        req.session.save();
        res.status(200).redirect('/me');
    }
});

module.exports = router;