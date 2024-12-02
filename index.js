const express = require('express');
const connection = require('./database/conn');
const errhandler = require('./middleware/errormiddleware');
const router = require('./routes/authroute');
const app = express();
const port = 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use('/',router);


app.use(errhandler);

connection().then(db => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}).catch(err => {
    console.error(err);
    process.exit(1);
});
