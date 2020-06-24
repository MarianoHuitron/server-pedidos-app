const jwt = require('jsonwebtoken');

// VERIFY TOKEN
function varifyToken(req, res, next) {
    console.log('ok')
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader)
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        
        jwt.verify(token, process.env.SECRET_KEY, (err, auth) => {
            if(err) return res.status(403).send({message: 'Favor de iniciar sesion'}); 
            next();
        });
    } else {
        return res.status(403).send({message: 'Favor de iniciar sesión'})
    }
}


module.exports = {varifyToken};