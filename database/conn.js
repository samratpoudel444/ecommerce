const { createConnection }= require('mysql2/promise');
const dotenv= require('dotenv');

dotenv.config();
async function connection()
{
    return createConnection(
{ 
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'hello'})

};

module.exports= connection;