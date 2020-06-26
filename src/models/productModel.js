const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    price: {
        type: Number,
        required: [true, 'El precio es requerido']
    },
    img_path: {
        type: String
    },
    status: {
        type: Boolean,
        required: [true, 'Se necesita un status']
    },
    created_at: {
        type: String
    }
});


module.exports = mongoose.model('product', productSchema);