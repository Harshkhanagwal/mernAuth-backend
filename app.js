const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')


require('./DB/connections');

const app = express();

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))


app.use('/', require('./routes/auth') )

const port = 8000;
app.listen(port, () => {
    console.log('listening to the PORT : ' + port)
})

