const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true
    }, 
    address: {
        type: String,
    },
    info_products: [{
        product: {type: Schema.Types.ObjectId, ref: 'product'},
        cant: {type: Number},
        subtotal: {type: Number}
    }],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'cancel']
    },
    session_id: {
        type: String
    },
    pay: {
        type: Boolean
    },
    created_at: {
        type: Date,
        required: true
    }

})