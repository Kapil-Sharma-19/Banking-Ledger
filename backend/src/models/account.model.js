const mongoose = require('mongoose');
const ledgerModel = require('./ledger.model');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [ true, 'User is required' ],
        index: true
    },
    status: {
        type: String,
        enum: [ 'active', 'frozen', 'closed' ],
        default: 'active',
        message: 'Status must be either active, frozen or closed'
    },
    currency: {
        type: String,
        required: [ true, 'Currency is required' ],
        default: 'INR'
    }
}, { timestamps: true });

accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function() {
    const balance = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        { $group: { _id: null, totalCredits: { $sum: { $cond: [ { $eq: [ '$type', 'credit' ] }, '$amount', 0 ] } }, totalDebits: { $sum: { $cond: [ { $eq: [ '$type', 'debit' ] }, '$amount', 0 ] } } } },
        { $project: { _id: 0, balance: { $subtract: [ '$totalCredits', '$totalDebits' ] } } }
    ]);
    return balance[0]?.balance || 0;
};

const accountModel = mongoose.model('Account', accountSchema);
module.exports = accountModel;