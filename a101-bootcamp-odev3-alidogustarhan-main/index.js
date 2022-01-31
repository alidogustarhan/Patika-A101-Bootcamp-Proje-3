//Require
const express = require('express');
const app = express()
const endPoint = require('./routes/api');
require('dotenv').config();

//Middlewares
app.use(express.json())

//Routes
app.use('/table',endPoint)


//Connect to server
app.listen(3000, () => {
    console.log('Server is running...!')
})
