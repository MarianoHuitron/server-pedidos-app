const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [8, 'Utilice por lo menos 8 caracteres']
    },
    phone: {
        type: String
    },
    adrress: [{
        id: {type: String},
        street: {type: String},
        number: {type: String},
        sub: {type: String},
        street1: {type: String},
        street2: {type: String},
        references: {type: String}
    }],
    rol: {
        type: String,
        enum: ['admin', 'customer', 'dealer']
    },
    created_at: {
        type: Date
    }
});


// Encrypt password

userSchema.pre('save', function(next) {
    bcrypt.genSalt(10).then(salts => {
        bcrypt.hash(this.password, salts).then(hash => {
            this.password = hash;
            next();
        }).catch(error => next(error));
    }).catch(error => next(error));
});


// Verify password

userSchema.methods.verifyPassword = function(password) {
    const verify = bcrypt.compareSync(password, this.password);
    return verify;
}


module.exports = mongoose.model('user', userSchema);