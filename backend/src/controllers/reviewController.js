import Review from '../models/review.js';
import Book from '../models/books.js';
import ErrorApi from '../middlewares/handleError.js';


export async function addReview(req, res, next) {
    try {
        const userId = req.user._id; 
        const { rating, feedbackText } = req.body;
        const { bookId } = req.params;


        if (!bookId || !rating) throw new ErrorApi("Book ID and Rating are required", 400);

        // Check sách tồn tại
        const book = await Book.findById(bookId);
        if (!book) throw new ErrorApi("Book not found", 404);

        const existing = await Review.findOne({userId, bookId});
        if(existing) {
            existing.rating = rating;
            await existing.save();
            return res.json({message: "Rating updated", rating: existing});
        }

        const newReview = await Review.create({
            user_id: userId,
            book_id: bookId,
            rating,
            feedbackText
        });

        const allReviews = await Review.find({ book_id: bookId });

        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const numOfReviews = allReviews.length;
        const averageRating = numOfReviews > 0 ? totalRating / numOfReviews : 0;

        book.averageRating = averageRating;
        book.numOfReviews = numOfReviews;
        await book.save();

       res.status(201).json({
            message: "Review added successfully",
            review: newReview,
            averageRating,
            numOfReviews
            });
    } catch (error) {
        next(error);
    }
};


export async function updateReview(req, res, next) {
    try {
        const userId = req.user._id;
        const { id } = req.params; 
        const { rating, feedbackText } = req.body;

        const review = await Review.findOneAndUpdate(
            { _id: id, user_id: userId },
            { rating, feedbackText },
            { new: true, runValidators: true }
        );

        if (!review) throw new ErrorApi("Review not found or unauthorized", 404);

        res.json({ message: "Review updated", review });
    } catch (error) {
        next(error);
    }
};

export async function deleteReview(req, res, next) {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const review = await Review.findOneAndDelete({ _id: id, user_id: userId });
        
        if (!review) throw new ErrorApi("Review not found or unauthorized", 404);

        res.json({ message: "Review deleted" });
    } catch (error) {
        next(error);
    }
};


export async function getReviewsByBook(req, res, next) {
    try {
        const { bookId } = req.params;
        const reviews = await Review.find({ book_id: bookId })
            .populate('user_id', 'displayname avatarUrl') 
            .sort({ createdAt: -1 }); 

        res.json(reviews);
    } catch (error) {
        next(error);
    }
};