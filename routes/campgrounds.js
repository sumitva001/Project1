 const express=require('express');
 const app = express();
 const router=express.Router();
 const catchAsync = require('../utils/catchAsync');
 const campgrounds=require('../contollers/campgrounds');
 const Campground = require('../models/campgrounds')
 const { campgroundSchema} = require('../schema')
const {isLoggedIn,isAuthor, validateCampground}=require('../middleware')
const {storage}=require('../cloudinary/index')
const multer = require('multer')
const upload=multer({storage})

router.route('/')
.get( catchAsync(campgrounds.index))
.post( isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))


router.get('/new',isLoggedIn, campgrounds.renderNewForm)
router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put( isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))




module.exports=router;