const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  try {

    if ( process.env.MONGO_MODE == 'test');{
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      // Set the environment variable so that connectDB uses the in-memory DB URI.
      process.env.MONGO_URI = uri;    
    }
  
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;
