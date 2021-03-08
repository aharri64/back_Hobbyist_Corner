// Import DB
const db = require('../models');

const index = async (req, res) => {
    const allProjects = await db.Project.find();
    if (allProjects.length >= 1) res.json({ projects: allProjects });
    else res.json({ projects: 'There are no projects' });
};

const create = (req, res) => {
    // Purpose: Create one example by adding body to DB, and return
    console.log('=====> Inside POST /project');
    console.log('=====> req.body');
    console.log(req.body); // object used for creating new example

    db.Project.create(req.body, (err, savedProject) => {
        if (err) console.log('Error in project#create:', err);
        res.json(savedProject);
    });
};



module.exports = {
    index,
}