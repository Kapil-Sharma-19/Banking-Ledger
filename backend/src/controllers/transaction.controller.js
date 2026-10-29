const mongoose = require('mongoose');
const transactionModel = require('../models/transaction.model');
const accountModel = require('../models/account.model');
const ledgerModel = require('../models/ledger.model');

/**
 * @name createTransactionController
 * @description Create a new transaction for a user
 * @access Protected
 */

const createTransactionController = async (req, res) => {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey ) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({ success: false, message: 'One or both accounts not found' });
    }

    const doesTransactionExist = await transactionModel.findOne({ idempotencyKey: idempotencyKey });
    if(doesTransactionExist) {
        if(doesTransactionExist.status === 'completed') {
            return res.status(400).json({ message: 'Transaction already completed', transaction: doesTransactionExist });
        } else if(doesTransactionExist.status === 'pending') {
            return res.status(200).json({ message: 'Transaction is still under processing', transaction: doesTransactionExist });
        } else if(doesTransactionExist.status === 'failed') {
            return res.status(400).json({ message: 'Previous transaction attempt failed, please try again', transaction: doesTransactionExist });
        } else {
            return res.status(400).json({ message: 'Transaction was reversed, please try again', transaction: doesTransactionExist });
        }
    }

    if(fromUserAccount.status !=='active' || toUserAccount.status !=='active') {
        return res.status(400).json({ message: 'Both accounts must be active to precess a transaction'});
    }

    const fromAccountBalance = await fromUserAccount.getBalance();
    if(fromAccountBalance < amount) {
        return res.status(400).json({ message: `Insufficient balance. Current balance is ${fromAccountBalance} but requested amount is ${amount}` });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const [ transaction ] = await transactionModel.create([ { fromAccount, toAccount, status: 'pending', amount, idempotencyKey } ], { session });
    
    const debitLedgerEntry = await ledgerModel.create([ { account: fromAccount, amount: amount, transaction: transaction._id, type: 'debit' } ], { session });
    const creditLedgerEntry = await ledgerModel.create([ { account: toAccount, amount: amount, transaction: transaction._id, type: 'credit' } ], { session });

    transaction.status = 'completed';
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: 'Transaction completed successfully', transaction: transaction });
};

/**
 * @name createInitialFundsTransactionController
 * @description Create a new transaction to add initial funds to the system
 * @access Protected (System User Only)
 */

const createInitialFundsTransactionController = async (req, res) => {
    const { toAccount, amount, idempotencyKey } = req.body;

    if(!toAccount || !amount || !idempotencyKey ) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    if (!toUserAccount) {
        return res.status(404).json({ success: false, message: 'Account not found' });
    }

    const fromUserAccount = await accountModel.findOne({ user: req.user.id });

    if(!fromUserAccount) {
        return res.status(404).json({ success: false, message: 'System user account not found' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const [ transaction ] = await transactionModel.create([ { fromAccount: fromUserAccount._id, toAccount, amount, idempotencyKey, status: 'pending' } ], { session });

    const debitLedgerEntry = await ledgerModel.create([ { account: fromUserAccount._id, amount: amount, transaction: transaction._id, type: 'debit' } ], { session });
    const creditLedgerEntry = await ledgerModel.create([ { account: toAccount, amount: amount, transaction: transaction._id, type: 'credit' } ], { session });

    transaction.status = 'completed';
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ message: 'Initial funds transaction completed successfully', transaction: transaction });
};

module.exports = { createTransactionController, createInitialFundsTransactionController };