import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB database ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in MongoDb database ${error}`);
  }
};

export default ConnectDB;
