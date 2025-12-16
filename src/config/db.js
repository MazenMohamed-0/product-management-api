const mongoose = require("mongoose");

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: true,
        });

        console.log("Connection To Database Successful");

    } catch (error) {
        console.log("Failed To Connect", error);
        process.exit(1);
        
    }
    
};

module.exports = connectDB;