import mongoose from "mongoose";

const publisherRequestSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },

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
    },

    statusProcess: {
        type: String,
        emum: ["pending", "approved", "rejected"],
        default: "pending"
    } 
}, { timestamps: true });

const PublisherRequest = mongoose.model('PublisherRequest', publisherRequestSchema);
export default PublisherRequest;