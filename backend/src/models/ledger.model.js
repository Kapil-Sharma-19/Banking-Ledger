const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [ true, 'Account is required' ],
        index: true,
        immutable: true,
    },
    amount: {
        type: Number,
        required: [ true, 'Amount is required' ],
        immutable: true,
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: [ true, 'Ledger must be associated with a transaction'],
        index: true,
        immutable:  true,
    },
    type: {
        type: String,
        required: [ true, 'Type is required' ],
        enum: [ 'debit', 'credit' ],
        immutable: true,
    }
},{ timestamps: true });

const preventLedgerModification = () => {
    throw new Error('Ledger entries cannot be modified or deleted');
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('findByIdAndUpdate', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('findByIdAndDelete', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('update', preventLedgerModification);
ledgerSchema.pre('findOneAndReplace', preventLedgerModification);

const ledgerModel = mongoose.model('Ledger', ledgerSchema);
module.exports = ledgerModel;