const { createConnection }= require('mysql2/promise');
const dotenv= require('dotenv');

dotenv.config();
async function connection()
{
    return createConnection(
{ 
    host:'localhost',
    user: 'root',
    password: 'password',
    database: 'ecommerce'})

};

module.exports= connection;