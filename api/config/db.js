import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = mongoose.connect(process.env.Mongo);