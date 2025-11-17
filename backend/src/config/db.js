import mongoose     from "mongoose";
import dotenv       from 'dotenv'


dotenv.config();
const urlConnect = process.env.MONGO_URI;
console.log(urlConnect);

const connect = async () => {
    try {
        await mongoose.connect(urlConnect, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('> Kết nối database thành công!');
    } catch (error) {
        if(error) {
            console.log('> Lỗi kết nối database: ', error.message);
        }
    }
}

export default { connect }