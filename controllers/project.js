// Import DB
const db = require('../models');

const index = async (req, res) => {
    const allProjects = await db.Project.find();
}


module.exports = {
    index,
    show
}