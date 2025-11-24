import Review from '../models/review.js';
import Book from '../models/books.js';
import ErrorApi from '../middlewares/handleError.js';

// 1. Thêm Review
export async function addReview(req, res, next) {
    try {
        // Giả sử bạn đã có middleware xác thực gán user vào req.user
        // Nếu chưa, bạn cần lấy userId từ body (nhưng cách này không bảo mật)
        const userId = req.user._id; 
        const { bookId, rating, feedbackText } = req.body;

        if (!bookId || !rating) throw new ErrorApi("Book ID and Rating are required", 400);

        // Check sách tồn tại
        const book = await Book.findById(bookId);
        if (!book) throw new ErrorApi("Book not found", 404);

        // Check xem user đã review chưa (Ngăn spam)
        const existingReview = await Review.findOne({ user_id: userId, book_id: bookId });
        if (existingReview) throw new ErrorApi("You have already reviewed this book", 409);

        const newReview = await Review.create({
            user_id: userId,
            book_id: bookId,
            rating,
            feedbackText
        });

        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        next(error);
    }
};

// 2. Sửa Review
export async function updateReview(req, res, next) {
    try {
        const userId = req.user._id;
        const { id } = req.params; // ID của Review
        const { rating, feedbackText } = req.body;

        // Tìm và update (cần check user_id để đảm bảo chính chủ)
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

// 3. Xóa Review
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

// 4. Lấy danh sách Review của 1 cuốn sách (Public)
export async function getReviewsByBook(req, res, next) {
    try {
        const { bookId } = req.params;
        const reviews = await Review.find({ book_id: bookId })
            .populate('user_id', 'displayname avatarUrl') // Chỉ lấy tên và avatar người comment
            .sort({ createdAt: -1 }); // Mới nhất lên đầu

        res.json(reviews);
    } catch (error) {
        next(error);
    }
};