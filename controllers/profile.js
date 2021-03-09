// Import DB
const db = require('../models');

const profile = async (req, res) => {
    const userProfile = await db.Profile.findOne({ User: req.user.id }).populate('user', ['name', 'email']);
    if (!profile) {
        return res.status(400).json({ message: 'There is no profile for this user'})
    }

    res.json(profile)

    console.log('====> inside /profile');
    console.log(req.body);
    console.log('====> user')
    console.log(req.user);
    // const { id, name, email } = req.user; // object with user object inside
    // res.json({ id, name, email });
    res.json(userProfile);
}

// const create = (req, res) => {
//     // Purpose: Create one example by adding body to DB, and return
//     console.log('=====> Inside POST /project');
//     console.log('=====> req.body');
//     console.log(req.body); // object used for creating new example

//     db.Project.create(req.body, (err, savedProject) => {
//         if (err) console.log('Error in project#create:', err);
//         res.json(savedProject);
//     });
// };



module.exports = {
    profile,
    // create
}