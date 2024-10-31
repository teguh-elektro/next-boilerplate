import mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    subscribe: { type: String, enum: ['free', 'premium'], default: 'free', required: true }, 
    updateAt: { type: Date, default: Date.now, required: true },
    createdAt: { type: Date, required: true }
});

const Users = mongoose.models.Users || mongoose.model('Users', UsersSchema);
export default Users;
