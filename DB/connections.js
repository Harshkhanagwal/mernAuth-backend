const mongoose = require('mongoose')
const dotenv =  require('dotenv')

dotenv.config({path : './.env'})

mongoose.set('strictQuery', false);
mongoose.set('strictQuery', true);

mongoose.connect(process.env.DB).then(() => {
    console.log("Database connected")
}).catch((err) => {
    console.log(err)
})