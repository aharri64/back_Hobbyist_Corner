// Imports
require('dotenv').config();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Database
const db = require('../models');

// Controllers
const test = (req, res) => {
    res.json({ message: 'User endpoint OK! ✅' });
}



const messages = async (req, res) => {
    console.log('====> inside /messages');
    console.log(req.body);
    console.log('====> user')
    console.log(req.user);
    const { id, name, email } = req.user; // object with user object inside
    const messageArray = ['message 1', 'message 2', 'message 3', 'message 4', 'message 5', 'message 6', 'message 7', 'message 8', 'message 9'];
    const sameUser = await db.User.findOne({ _id: id });
    res.json({ id, name, email, message: messageArray, sameUser });
}



// Exports
module.exports = {
    test,
    messages,
}