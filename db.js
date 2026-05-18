const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://mahesh:@Mahesh2004@cluster0.0cgqdqe.mongodb.net/inotebook?appName=Cluster0";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

module.exports = connectToMongo;