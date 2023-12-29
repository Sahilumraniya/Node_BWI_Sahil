import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MONGODB connection SUCCESS ${connection.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection ERROR : ", error);
    process.exit(1);
  }
};

export default connectDb;
