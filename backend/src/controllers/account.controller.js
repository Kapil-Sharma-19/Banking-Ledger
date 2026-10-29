const accountModel = require('../models/account.model');

/**
 * @name createAccountController
 * @description Create a new account for a user
 * @access Protected
 */

const createAccountController = async (req, res) => {
    try {
        const userId = req.user.id;
        const account = await accountModel.create({ user: userId });
        res.status(201).json({ success: true, data: account });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @name getAccountController
 * @description Get account details for a user
 * @access Protected 
 */

const getAccountController = async (req, res) => {
    try {
        const userId = req.user.id;
        const accounts = await accountModel.find({ user: userId });
        res.status(200).json({ success: true, accounts: accounts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @name getAccountBalanceController
 * @description Get account balance for a specific account
 * @access Protected
 */

const getAccountBalanceController = async (req, res) => {
    try {
        const accountId = req.params.accountId;
        const account = await accountModel.findOne({ _id: accountId, user: req.user.id });
        if (!account) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }
        const balance = await account.getBalance();
        res.status(200).json({ success: true, balance: balance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createAccountController, getAccountController, getAccountBalanceController };