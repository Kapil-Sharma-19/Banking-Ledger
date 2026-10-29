const userModel = require('../models/user.model');
const blacklistModel = require('../models/blacklist.model');
const jwt = require('jsonwebtoken');

/**
 * @name registerUserController
 * @description Register a new user, expects name, username, email and password in request body
 * @access Public
 */

const registerUserController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username||!email||!password){
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const doesUserAlreadyExists = await userModel.findOne({ $or: [{ email }, { username }] });

        if(doesUserAlreadyExists){
            return res.status(400).json({ error: 'User already exists.' });
        }

        const user = await userModel.create({ username, email, password });
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token);
        res.status(201).json({
            message: 'User registered successfully.',
            user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }, token});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @name loginUserController
 * @description login an existing user, expects email and password in request body
 * @access Public
 */

const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email||!password){
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const user = await userModel.findOne({ email }).select('+password');
        if(!user){
            return res.status(400).json({ error: 'Invalid credentials.' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid){
            return res.status(400).json({ error: 'Invalid credentials.' });
        }
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token);
        res.status(200).json({
            message: 'User logged in successfully.',
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @name logoutUserController
 * @description logout a logged in user
 * @access Public
 */

const logoutUserController = async (req, res ) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({ error: 'No token provided.' });
        }
        await blacklistModel.create( { token });
        res.clearCookie("token");
        res.status(200).json({ message: 'User logged out successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registerUserController, loginUserController, logoutUserController };