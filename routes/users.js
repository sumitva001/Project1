const express=require('express');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync')
const { route } = require('./campgrounds');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users=require('../contollers/users');

router.route('/register')
.get(users.renderRegister)
.post( users.register );

router.route('/login')
.get(users.renderLogin)
.post( storeReturnTo, passport.authenticate('local',{failureFlash:true, failureRedirect: '/login'}),users.login)

router.get('/logout',users.logout ); 
module.exports=router;