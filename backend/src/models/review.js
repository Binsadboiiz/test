import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
    },
    feedbackText: {
        type: String,
        default: ""
    },
    commentCount: {
        type: Number,
        default: 0
    },
    rateAvg: {
        type: Number,
        default: 0
    },
    commentBook: {
        type: String,
        default: ""
    },
    reviewBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;