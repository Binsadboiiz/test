import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordOld: {
        type: String,
        default: null
    },
    password: {
        type: String,
        required: true
    },
    displayname: {
        type: String,
        default: "",
        trim: true
    },
    avatarUrl: {
        type: String,
        default: ""
    },
    roles: {
        type: [String],
        enum: ["user", "admin", "publisher"],
        default: ["user"]
    }, 
    isBlocked: {
        type: Boolean,
        default: false
    },
    favoriteBooks: {
        type: String,
        default: ""
    }
}, {timestamps: true});

const User = mongoose.model("User", UserSchema);
export default User;