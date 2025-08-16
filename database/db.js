require('dotenv').config()


const mongoose = require('mongoose')
const MONGO_URI = process.env.MONGO_URI



const connectToDB = async()=>{

    
   await mongoose.connect(MONGO_URI)
    .then(console.log('database connected successfully'))
    .catch(err=>console.log('error connect to database: ',err))
}


module.exports = connectToDB