import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

const app = express();

















app.get('/', (req, res)=>{
    res.send("API is Working");
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server is running on http://localhost:${PORT}`));