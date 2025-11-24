import mongoose from 'mongoose';
import Book from './books.js'; 

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, min: 1, max: 5, required: true },
    feedbackText: { type: String, default: "", trim: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true } 
}, { timestamps: true });

reviewSchema.statics.calcAverageRatings = async function(bookId) {
    const stats = await this.aggregate([
        { $match: { book_id: bookId } },
        { $group: { 
            _id: '$book_id', 
            nRating: { $sum: 1 }, 
            avgRating: { $avg: '$rating' } 
        }}
    ]);

    if (stats.length > 0) {
        await Book.findByIdAndUpdate(bookId, {
            averageRating: Math.round(stats[0].avgRating * 10) / 10,
            numOfReviews: stats[0].nRating
        });
    } else {
        await Book.findByIdAndUpdate(bookId, { averageRating: 0, numOfReviews: 0 });
    }
};

reviewSchema.post('save', function() {
    this.constructor.calcAverageRatings(this.book_id);
});

reviewSchema.post(/^findOneAnd/, async function(doc) {
    if (doc) await doc.constructor.calcAverageRatings(doc.book_id);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;