// Import DB
const db = require('../models');

const index = async (req, res) => {
    const allMessages = await db.Message.find();
    if (allMessages.length >= 1) res.json({ messages: allMessages });
    else res.json({ messages: 'There are no messages' });
}

const show = async (req, res) => {
    const showMessage = await db.Message.findOne({ _id: req.params.id });
    res.json({ message: showMessage });
}


module.exports = {
    index,
    show
}