const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [ true, 'Account 1 is required' ],
        index: true,
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [ true, 'Account 2 is required' ],
        index: true,
    },
    status: {
        type: String,
        required: [ true, 'Status is required' ],
        enum: [ 'pending', 'completed', 'failed', 'reversed' ],
        default: 'pending',
    },
    amount: {
        type: Number,
        required: [ true, 'Amount is required' ],
        min: [ 0, 'Amount must be positive' ],
    },
    idempotencyKey: {
        type: String,
        required: [ true, 'Idempotency key is required' ],
        unique: true,
        index: true,
    }
}, { timestamps: true });

const transactionModel = mongoose.model('Transaction', transactionSchema);
module.exports = transactionModel;