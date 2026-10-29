const express = require('express');
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const transactionRouter = express.Router();

transactionRouter.post('/', authMiddleware.authUser, transactionController.createTransactionController);
transactionRouter.post('/system/initial-funds', authMiddleware.authSystemUser, transactionController.createInitialFundsTransactionController);

module.exports = transactionRouter;