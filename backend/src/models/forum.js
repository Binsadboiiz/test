import mongoose from 'mongoose';

const forumSchema = new mongoose.Schema({
    forumTitle: {
        type: String,
        require: true
    },
    forumContent: {
        type: String,
        default: ""
    },
    countLikes: {
        type: Number,
        default: 0
    },
    forumBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Forum = mongoose.model('Forum', forumSchema);
export default Forum;