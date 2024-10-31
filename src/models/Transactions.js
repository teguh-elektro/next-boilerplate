import mongoose from 'mongoose';

const TransactionsSchema = new mongoose.Schema({
    email: { type: String, required: true }, 
    orderID: { type: String, required: true }, 
    itemName: { type: String, required: true }, 
    itemQuantity: { type: Number, required: true }, 
    amount: { type: Number, required: true }, 
    currency: { type: String, required: true },
    status: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now, required: true}
});

const Transactions = mongoose.models.Transactions || mongoose.model('Transactions', TransactionsSchema);
export default Transactions;
