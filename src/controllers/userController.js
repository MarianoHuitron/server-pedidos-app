const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const token = require('../middlewares/jwt');
const { use } = require('../routes/userRoutes');

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


// CREATE ADRESS
async function createAddress(req, res) {
    const payload = token.decodeToken(req.token);
    const userId = payload.payload.sub;
    const address = req.body;
    address.id = new Date().toISOString();

    const user = await User.findById(userId);
    user.address.push(address);

    const updated = await user.updateOne(user);

    res.status(200).send({message: 'OK'});
    
}


// GET ADRESSES
function getAddresses(req, res) {
    const payload = token.decodeToken(req.token);
    const userId = payload.payload.sub;
    
    User.findById(userId)
        .select('address -_id')
        .exec((err, address) => {
            console.log(address);
            if(err) return res.status(422).send(err);
            res.status(200).send(address)
        });
}

// UPDATE ADRESS
async function updateAddress(req, res) {
 
    const addressSelected = req.params.address;
    const data = req.body;

    const updated = await User.updateOne({"address._id": addressSelected}, {$set: 
        {
            "address.$.street": data.street,
            "address.$.number": data.number,
            "address.$.sub": data.sub,
            "address.$.street1": data.street1,
            "address.$.street2": data.street2,
            "address.$.references": data.references
        }
    });

    res.status(200).send(updated);
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



module.exports = {
    newUser,
    auth,
    createAddress,
    updateAddress,
    getAddresses
}



