const express= require('express');
const connection = require('./database/conn');
const app= express();

const dotenv= require('dotenv');

dotenv.config();
app.post('/', async(req, resp)=>
{
    console.log(process.env.DB_PASSWORD);
    const db= await connection();
    console.log(await db);
    resp.send('found');
})
app.listen(1111);