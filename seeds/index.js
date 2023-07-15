
const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');
const Review = require('../models/review');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log('Database connected');
})



const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({})


    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '64b000e0bd3a2a58962e1bd6',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [{
                url: 'https://res.cloudinary.com/drhzsyckt/image/upload/v1689356040/YelpCamp/yjbk8yhkvl0mycs2w3ez.jpg',
                filename: 'YelpCamp/yjbk8yhkvl0mycs2w3ez',

            },
            {
                url: 'https://res.cloudinary.com/drhzsyckt/image/upload/v1689356041/YelpCamp/own498cgfdk3l6qx1r5k.jpg',
                filename: 'YelpCamp/own498cgfdk3l6qx1r5k',

            },
            {
                url: 'https://res.cloudinary.com/drhzsyckt/image/upload/v1689356044/YelpCamp/tsbmub8ynfjc76pcsyhq.jpg',
                filename: 'YelpCamp/tsbmub8ynfjc76pcsyhq',

            }
            ],

            geometry:
            {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },

            description: 'I am a campground',
            price: Math.floor(Math.random() * 20) + 10
        })

        await camp.save();

    }
    // const c=new Campground({
    //     title: 'purple fields'
    // })
    // await c.save();


}

seedDB().then(() => {
    mongoose.connection.close();
});
