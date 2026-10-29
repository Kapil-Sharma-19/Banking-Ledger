const express = require('express');
const accountController = require('../controllers/account.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const accountRouter = express.Router();

accountRouter.post('/create', authMiddleware.authUser, accountController.createAccountController);
accountRouter.get('/get', authMiddleware.authUser, accountController.getAccountController);
accountRouter.get('/get-balance/:accountId', authMiddleware.authUser, accountController.getAccountBalanceController);

module.exports = accountRouter;