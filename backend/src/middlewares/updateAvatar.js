import multer from "multer";
import path from "path";
import fs from "fs";
import { updateProfile } from "../controllers/profileController.js";

const uploadDir = path.join(process.cwd(), "uploads", "avatars");
fs.mkdirSync(uploadDir, { recursive: true});

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${req.user._id}-${Date.now()}${ext}`;
        cb(null, name);
    }
});

function fileFilter(_, file, cb) {
    const allowed = [".png", ".jpg", ".jpeg"];
    const ext = path.extname(file.originalname).toLowerCase();
    if(!allowed.includes(ext)) return cb(new Error("File type not allowed"));
    cb(null, true);
}
const uploadAvatar = multer({
    storage,
    limits: {fileSize: 2 * 1024 * 1024},
    fileFilter
});

export default uploadAvatar;