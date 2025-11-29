import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "img");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = Date.now() + "-" + Math.random().toString(36).slice(2,9);
    cb(null, `${base}${ext}`);
  }
});

export const upload = multer({ storage });
export const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "bookFile", maxCount: 1 }
]);
