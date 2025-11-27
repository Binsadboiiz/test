import Comment from "../models/comments.js";
import Book from "../models/books.js";
import ErrorApi from "../middlewares/handleError.js";

export async function getCommentsByBook(req, res, next) {
  try {
    const { bookId } = req.params;
    // basic validation
    if (!bookId) throw new ErrorApi("Missing book id", 400);

    const comments = await Comment.find({ book: bookId })
      .sort({ createdAt: -1 })
      .populate("user", "username displayname avatarUrl");

    res.json({ comments });
  } catch (err) {
    next(err);
  }
}


export async function createComment(req, res, next) {
  try {
    const { book: bookId, content } = req.body;
    const userId = req.user?._id;
    if (!userId) throw new ErrorApi("Unauthorized", 401);
    if (!bookId || !content) throw new ErrorApi("Missing fields", 400);

    const book = await Book.findById(bookId);
    if (!book) throw new ErrorApi("Book not found", 404);

    const comment = await Comment.create({
      book: bookId,
      user: userId,
      content,
    });

    await comment.populate("user", "username displayname avatarUrl").execPopulate?.() // for mongoose <6 safe
    const populated = await Comment.findById(comment._id).populate("user", "username displayname avatarUrl");

    res.status(201).json({ comment: populated });
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) throw new ErrorApi("Unauthorized", 401);

    const comment = await Comment.findById(id);
    if (!comment) throw new ErrorApi("Comment not found", 404);

    const isOwner = comment.user.toString() === userId.toString();
    const isAdmin = req.user?.roles?.includes?.("admin") || req.user?.isAdmin;

    if (!isOwner && !isAdmin) throw new ErrorApi("Forbidden", 403);

    await comment.deleteOne();

    res.json({ message: "Comment deleted", id });
  } catch (err) {
    next(err);
  }
}
