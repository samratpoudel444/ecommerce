const mysql= require('mysql2/promise');
const dotenv= require('dotenv');
dotenv.config();

async function connection()
{
    try{
    const db= mysql.createConnection(
        {
            host : process.env.host,
            user : process.env.user,
            password :process.env.password,
            database :process.env.database
        }
     
    )
    return db;
    }

    catch(err)
    {
        console.log(err);
    }
}

module.exports= connection;
