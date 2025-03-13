const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectToDb = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to Mongodb");
    }catch(err){
        console.error("Error connecting to MongoDB", err);
        throw err;
    }
};

module.exports = connectToDb;