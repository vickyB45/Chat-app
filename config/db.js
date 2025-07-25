import mongoose from "mongoose";

const mongoDB = async () => {
  try {

    mongoose.connection.on('connected',()=>{
      console.log("Database Connected!")
    })
    await mongoose.connect(`${process.env.MONGO_URL}/chat-web-app`);
    
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
  }
};

export default mongoDB;
