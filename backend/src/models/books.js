import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({ 
    bookTitle: {
        type: String,
        required: true,
        trim: true
    },
    bookAuthor: {
        type: String,
        required: true,
        trim: true
    },
    bookDescription: {
        type: String,
        default: "",
        trim: true  
    },
    bookPublicationYear: {
        type: Number,
        required: true,
        min: 0,
        max: new Date().getFullYear()
    },
    bookGenre: {
        type: [String],
        default: []
    },
    thumbnailUrl: {
        type: String,
        default: ""
    }, 
    publisher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publisher',
        required: true
    }
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);
export default Book;