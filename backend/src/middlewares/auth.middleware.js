const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blacklistedModel = require('../models/blacklist.model');

const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ error: 'No token provided.' });
    }

    const isTokenBlacklisted = await blacklistedModel.findOne({ token });
    if (isTokenBlacklisted) {
        return res.status(401).json({ error: 'Token has been blacklisted.' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

const authSystemUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({ error: 'No token provided.' });
    }

    const isTokenBlacklisted = await blacklistedModel.findOne({ token });
    if (isTokenBlacklisted) {
        return res.status(401).json({ error: 'Token has been blacklisted.' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('+systemUser');
        if(!user || !user.systemUser){
            return res.status(403).json({ error: 'Access denied. System user only.' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

module.exports = { authUser, authSystemUser };