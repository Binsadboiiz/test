import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import chalk from 'chalk';
import boxen from 'boxen';
import connectDB from './config/db.js';
import router from './routes/index.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
router(app);
connectDB.connect();
//Chạy lại npm i để cập nhật thư viện

//Tạo 1 file .env là con của backend và thêm
//PORT=3000
//MONGO_URI=mongodb://localhost:27017/miniproject

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