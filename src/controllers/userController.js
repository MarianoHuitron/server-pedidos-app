const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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


// FUNCTION AUTHENTICATE
async function auth(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
        .select('name email rol password')
        .exec((err, user) => {
            console.log(user)
            if(user == null) return res.status(422).send({errors: {email: {properties: {message: 'Usuario no encontrado'}}}});

            if(!user.verifyPassword(password)) return res.status(422).send({errors: {password: {properties: {message: 'Contraseña incorrecta'}}}});

            const payload = {
                sub: user._id,
                name: user.name,
                rol: user.rol
            };

            jwt.sign({payload}, process.env.SECRET_KEY, {expiresIn: '30d'}, (err, token) => {
                res.status(200).send({token});
            }); 
            
        });

}

function x(req, res) {
    res.send('Validate');
}



module.exports = {
    newUser,
    auth,
    x
}



