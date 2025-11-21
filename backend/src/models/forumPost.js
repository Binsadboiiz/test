import mongoose from 'mongoose';
import Thread from './forumThread.js';

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    thread_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// --- Hook: Tự động cập nhật Thread khi có Post mới ---
postSchema.post('save', async function() {
    await Thread.findByIdAndUpdate(this.thread_id, {
        $inc: { repliesCount: 1 },      // Tăng số câu trả lời lên 1
        lastActiveAt: new Date()        // Cập nhật thời gian hoạt động mới nhất
    });
});

// --- Hook: Tự động cập nhật khi xóa Post ---
postSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Thread.findByIdAndUpdate(doc.thread_id, {
            $inc: { repliesCount: -1 }
        });
    }
});

const Post = mongoose.model('Post', postSchema);
export default Post;