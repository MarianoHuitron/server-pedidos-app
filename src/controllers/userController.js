const User = require('../models/userModel');


// CREATE USER
function newUser(req, res) {
    const nDate = new Date().toLocaleString('en-US', {
        timeZone: process.env.TZ
    });
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.rol = req.body.rol;
    user.created_at = nDate;
    user.save((err, doc) => {
        if(err) {
            if(err.code == 11000) return res.status(422).send({errors: {email: {properties: {message: 'Email ya registrado'}}}});

            return res.status(422).send(err);
        }

        res.status(200).send(doc);
    })
}


module.exports = {
    newUser
}



