import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

export const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URL!);

}