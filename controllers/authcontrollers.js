const connection = require("../database/conn");
const {v4: uuidv4}= require('uuid');
const bcrypt= require('bcrypt');
const { passwordRegex, userNameRegex } = require("./regex");


const signUpUsers= async(req, resp, next)=>
{
    try{
        const {firstname, lastname, username, password, confirmpassword, email}= req.body;
        if(password !== confirmpassword)
        {
            return resp.send('please make the password and confirm password same');
        }
      
        // if(!userNameRegex.test(username))
        //     {
        //         return resp.send('not valid username')
        //     }

        // if(!passwordRegex.test(password))
        // {
        //     return resp.send('not valid password')
        // }

       
    
        const db= await connection();
        const id= uuidv4();
        const date= new Date();
        const pass= bcrypt.hash(password, 10);


         const [rows, fields]= await db.query('insert into registration (id, first_name, last_name ,username, password, email,  created_at)values (?, ?, ?, ?, ?, ? , ?)' ,[id, firstname, lastname, username, password, email, date]);
        

    }
    catch(err)
    {
        console.log(err);
    }
}

module.exports= {signUpUsers};