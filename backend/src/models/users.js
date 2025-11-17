import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordOld: {
        type: String,
        default: null
    },
    passwordHash: {
        type: String,
        require: true
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