const mongoose = require("mongoose");
const useInMemoryDb = process.env.MONGO_URI !== null;

let connectDB = null;
if (useInMemoryDb){
  const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    process.exit(1);
  }
}
else {
  connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed", error);
    process.exit(1);
  }
};
}

module.exports = connectDB;
