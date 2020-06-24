const User = require('../models/userModel');

function newUser(req, res) {
    res.send('Hello User')
}


module.exports = {
    newUser
}



