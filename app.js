
if(process.env.NODE_ENV!== 'production'){
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport=require('passport');
const mongoSanitize = require('express-mongo-sanitize');
const LocalStrategy=require('passport-local');
const User=require('./models/user')

const campgroundRoutes=require('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews');
const userRoutes=require('./routes/users')

const session=require('express-session');
const MongoStore=require('connect-mongo');

const helmet=require('helmet');
const secret=process.env.SECRET|| 'thisshouldbeabettersecret!'
const dbUrl= process.env.DB_URL||'mongodb://127.0.0.1:27017/yelp-camp'
const store=MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24*60*60,
    crypto:{
        secret
    }
});

store.on('error', function(e){
    console.log('session store error', e);
})
const sessionConfig={
    store,
    name:'ses',
      secret,
      resave:false,
      saveUninitialized:true,
      cookie: {
        httpOnly:true,
        // secure:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:Date.now() + 1000*60*60*24*7,
        
      }
}

const flash=require('connect-flash');
const { profileEnd } = require('console');
app.use(flash())
app.use(session(sessionConfig))
//passport
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(mongoSanitize());

app.use(helmet({
    contentSecurityPolicy: false,
}));

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
   res.locals.success= req.flash('success');
   res.locals.error=req.flash('error');
   next();
})


// const Review = require('./models/review')
// const Campground = require('./models/campgrounds')
// const catchAsync = require('./utils/catchAsync');
// const { campgroundSchema, reviewSchema } = require('./schema')

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'public')))
app.engine('ejs', ejsMate);





// process.env.DB_URL


mongoose.connect(dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database connected');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get('/', (req, res) => {
    res.render('home');
})

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/',userRoutes);

// app.get('/campgrounds', async (req, res) => {

//     const campgrounds = await Campground.find({});
//     res.render('campgrounds/index', { campgrounds });
// })

// app.get('/campgrounds/new', (req, res) => {
//     res.render('campgrounds/new');
// })

// app.get('/campgrounds/:id/edit', async (req, res) => {

//     const campground = await Campground.findById(req.params.id);

//     res.render('campgrounds/edit', { campground });



// })
// app.get('/campgrounds/:id', catchAsync(async (req, res) => {

//     const { id } = req.params;

//     const campground = await Campground.findById(id).populate('reviews');
//     console.log(campground)

//     res.render('campgrounds/show', { campground });

// }))
// app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
//     res.redirect(`/campgrounds/${campground._id}`);
// }))
// app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {

//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);


// }))
// app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Campground.findByIdAndDelete(id);
//     res.redirect('/campgrounds');
// }))

// app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review)
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);

// }))



// app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
//     await Review.findByIdAndDelete(reviewId)
//     res.redirect(`/campgrounds/${id}`)


// }))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went Wrong'
    res.status(statusCode).render('error', { err });

})

app.listen(3000, () => {
    console.log('port 3k');
})