import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import routerUser from './src/routes/userRoutes.js';
import connectDB from './src/config/db.js';

const app = express();

connectDB();

app.use(express.json());
app.use('/api/users', routerUser);


app.get('/', (req, res)=>{
    res.send("API is Working");
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server is running on http://localhost:${PORT}`));