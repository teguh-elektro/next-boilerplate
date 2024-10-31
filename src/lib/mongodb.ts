import mongoose from 'mongoose';

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(process.env.MONGODB_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as any);
};

export default dbConnect;
