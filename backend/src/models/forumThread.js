import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['General', 'Book Discussion', 'Reviews', 'Off-topic'], // Các danh mục
        default: 'General'
    },
    views: {
        type: Number,
        default: 0
    },
    repliesCount: {
        type: Number,
        default: 0
    },
    lastActiveAt: { // Dùng để sắp xếp bài nào mới có bình luận lên đầu
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index text search để tìm kiếm trong forum
threadSchema.index({ title: 'text', content: 'text' });

const Thread = mongoose.model('Thread', threadSchema);
export default Thread;