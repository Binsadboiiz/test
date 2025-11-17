import mongoose from 'mongoose';

const publisherSchema = new mongoose.Schema({
    pubName: {
        type: String,
        require: true,
        trim: true
    },
    pubAddress: {
        type: String,
        default: "",
        trim: true
    },
    pubPhone: {
        type: Number,
        required: true
    },
    pubEmail: {
        type: String,
        require: true,
    },
    pubDescription: {
        type: String,
        default: "",
        trim: true
    }
}, { timestamps: true });

const Publisher = mongoose.model('Publisher', publisherSchema);
export default Publisher;