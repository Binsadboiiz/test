import mongoose from "mongoose";
const {connection} = mongoose;

export default async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/library_management');
        console.log(`MongoDB Connected: ${connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};