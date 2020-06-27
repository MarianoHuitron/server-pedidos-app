const jwt = require('jsonwebtoken');

// VERIFY TOKEN
function verifyToken(req, res, next) {
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

function isAdmin(req, res, next) {

    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        
        jwt.verify(token, process.env.SECRET_KEY, (err, auth) => {
            if(err) return res.status(403).send({message: 'Favor de iniciar sesion'}); 
            req.token = token;

            const {payload} = jwt.decode(token, process.env.SECRET_KEY);

            if(payload.rol != 'admin') return res.status(403).send({message: 'No cuenta con permisos de administrador'}); 

            next();
        });
    } else {
        return res.status(403).send({message: 'Favor de iniciar sesión'})
    }
}



module.exports = {verifyToken, decodeToken, isAdmin};