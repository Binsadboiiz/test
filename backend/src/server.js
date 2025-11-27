import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import chalk from 'chalk';
import boxen from 'boxen';
import connectDB from './config/db.js';
import router from './routes/index.js';
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static("uploads"));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

router(app);
await connectDB.connect();
//Chạy lại npm i để cập nhật thư viện

//Tạo 1 file .env là con của backend và thêm
// MONGO_URI=mongodb+srv://dbBook:dbbook@book-management.k9uql4d.mongodb.net/bookDB
// JWT_SECRET=phcuongdepzaii123
// FRONTEND_URL=http://localhost:5173
// EMAIL_USER=
// EMAIL_PASS=
// NODE_ENV=development

//Các router được dời qua index để cho gọn


app.listen(PORT, () => {
    const msg = `
============ SERVER RUNNING ===========
Visit http://localhost:${PORT}
`;
    console.log(
        boxen(chalk.green(msg), {
            padding: 1,
            margin: 1,
            borderColor: 'green',
            borderStyle: 'round'
        })
    );
});