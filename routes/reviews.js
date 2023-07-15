const express=require('express');
 const app = express();
 const router=express.Router({mergeParams:true});
 const catchAsync = require('../utils/catchAsync');
 const ExpressError = require('../utils/ExpressError');
 const {isLoggedIn,validateReview, isReviewAuthor}=require('../middleware');
const reviews=require('../contollers/reviews');
 



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports=router