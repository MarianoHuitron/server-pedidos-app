const jwt = require('jsonwebtoken');

// VERIFY TOKEN
function varifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        
        jwt.verify(token, process.env.SECRET_KEY, (err, auth) => {
            if(err) return res.status(403).send({message: 'Favor de iniciar sesion'}); 
            req.token = token;
            next();
        });
    } else {
        return res.status(403).send({message: 'Favor de iniciar sesión'})
    }
}

function decodeToken(token) {
    const data = jwt.decode(token, process.env.SECRET_KEY);
    return data;
}



module.exports = {varifyToken, decodeToken};