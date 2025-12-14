import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }



    
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ MongoDB connected successfully');
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    throw new Error('Connection Failed!');
  }
};

export default dbConnect;
