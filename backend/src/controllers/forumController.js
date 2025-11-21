import Thread from '../models/forumThread.js';
import Post from '../models/forumPost.js';
import ErrorApi from '../middlewares/handleError.js';

// =================================================
// 1. TẠO CHỦ ĐỀ MỚI (Thread)
// =================================================
export async function createThread(req, res, next) {
    try {
        const userId = req.user._id; // Lấy từ token
        const { title, content, category } = req.body;

        if (!title || !content) {
            throw new ErrorApi("Title and content are required", 400);
        }

        const newThread = await Thread.create({
            title,
            content,
            category,
            author: userId,
            lastActiveAt: new Date()
        });

        res.status(201).json({
            message: "Thread created successfully",
            thread: newThread
        });
    } catch (error) {
        next(error);
    }
};

// =================================================
// 2. LẤY DANH SÁCH CHỦ ĐỀ (Có lọc & phân trang)
// =================================================
export async function getThreads(req, res, next) {
    try {
        const { category, q, page = 1, limit = 10 } = req.query;
        
        let query = {};

        // Lọc theo danh mục
        if (category) {
            query.category = category;
        }

        // Tìm kiếm theo từ khóa (Title)
        if (q) {
            query.title = { $regex: q, $options: 'i' };
        }

        const threads = await Thread.find(query)
            .populate('author', 'displayname avatarUrl') // Lấy thông tin người tạo
            .sort({ lastActiveAt: -1 }) // Bài nào mới hoạt động lên đầu
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Thread.countDocuments(query);

        res.json({
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            threads
        });
    } catch (error) {
        next(error);
    }
};

// =================================================
// 3. XEM CHI TIẾT CHỦ ĐỀ (Kèm danh sách trả lời)
// =================================================
export async function getThreadDetails(req, res, next) {
    try {
        const { id } = req.params;

        // 1. Lấy thông tin chủ đề và tăng view
        const thread = await Thread.findByIdAndUpdate(
            id, 
            { $inc: { views: 1 } }, 
            { new: true }
        ).populate('author', 'displayname avatarUrl roles');

        if (!thread) throw new ErrorApi("Thread not found", 404);

        // 2. Lấy tất cả các câu trả lời (Posts) của chủ đề này
        const posts = await Post.find({ thread_id: id })
            .populate('author', 'displayname avatarUrl roles')
            .sort({ createdAt: 1 }); // Cũ nhất lên trước (giống Facebook comment)

        res.json({
            thread,
            posts
        });
    } catch (error) {
        next(error);
    }
};

// =================================================
// 4. TRẢ LỜI CHỦ ĐỀ (Reply/Post)
// =================================================
export async function addReply(req, res, next) {
    try {
        const userId = req.user._id;
        const { id } = req.params; // ID của Thread
        const { content } = req.body;

        if (!content) throw new ErrorApi("Content cannot be empty", 400);

        // Kiểm tra thread có tồn tại không
        const threadExists = await Thread.exists({ _id: id });
        if (!threadExists) throw new ErrorApi("Thread not found", 404);

        const newPost = await Post.create({
            content,
            thread_id: id,
            author: userId
        });

        // Lấy thông tin tác giả để trả về ngay lập tức cho Frontend hiển thị
        await newPost.populate('author', 'displayname avatarUrl');

        res.status(201).json({
            message: "Reply added",
            post: newPost
        });
    } catch (error) {
        next(error);
    }
};

// =================================================
// 5. XÓA CHỦ ĐỀ (Chỉ Admin hoặc Chủ bài viết)
// =================================================
export async function deleteThread(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const userRole = req.user.roles; // roles là array

        const thread = await Thread.findById(id);
        if (!thread) throw new ErrorApi("Thread not found", 404);

        // Kiểm tra quyền: Phải là Admin HOẶC là người tạo bài viết
        const isAdmin = userRole.includes('admin');
        const isAuthor = thread.author.toString() === userId.toString();

        if (!isAdmin && !isAuthor) {
            throw new ErrorApi("Unauthorized to delete this thread", 403);
        }

        // Xóa Thread
        await Thread.findByIdAndDelete(id);

        // Xóa luôn tất cả Post thuộc Thread đó (Dọn rác)
        await Post.deleteMany({ thread_id: id });

        res.json({ message: "Thread and associated posts deleted successfully" });
    } catch (error) {
        next(error);
    }
};