const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const User = require('./user');
const { string, required } = require('joi');


const opts={toJSON: {virtuals: true}};
const imageSchema = new Schema({
    url: String,
    filename: String

})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})


const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [imageSchema],
    description: String,
    location: String,
    geometry:
    {
        type: {
            type:String,
            enum: ['Point'],
            required: true
        },

        coordinates: {
            type:[Number],
            required:true
        }


    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
},opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <strong><a href='/campgrounds/${this._id}'> ${this.title}</a></strong>
    <p>${this.description.substring(0,20)+'...'}
    </p>
    `;
})

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    console.log(doc);
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})



module.exports = (mongoose.model('Campground', CampgroundSchema));