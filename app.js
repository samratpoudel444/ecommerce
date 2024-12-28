const express= require('express');
const connection = require('./backend/database/conn');
const loginrouter = require('./backend/routes/userroute');
const cors = require('cors');

const app= express();
app.use(express.json());
app.use(express.static("frontend"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(loginrouter);

app.listen(3000);
