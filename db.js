const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://mahikonnur07_db_user:QDHt5Vo1DEffte8m@cluster0.lrcudaz.mongodb.net/inotebook?retryWrites=true&w=majority";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

module.exports = connectToMongo;