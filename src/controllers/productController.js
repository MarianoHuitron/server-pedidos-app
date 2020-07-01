const Product = require('../models/productModel');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary');
const fs = require('fs-extra');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

let imagen;

// Sttings multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) => {
        imagen = Date.now() + '-' + file.originalname;
        imagen = imagen.replace('jpg', 'jpeg');
        cb(null, imagen);
    }
});

const uploadImage = multer({
    storage, 
    // limits: {fileSize: 1000000}
}).single('image[]');


// CREATE PRODUCT
function createProduct(req, res) {
    
    // upluoad image at the server
    uploadImage(req, res, async (err) => {
        if (err) {
            err.message = 'The file is so heavy for my service';
            return res.send(err);
        }
        // upload image Cloudinary
        const result = await cloudinary.v2.uploader.upload(req.file.path)

        // Save data on mongo
        const nDate = new Date().toLocaleString('en-US', {
            timeZone: process.env.TZ
        });
        
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            img_path: result.secure_url,
            status: req.body.status,
            created_at: nDate
        });

        await product.save();
        // delete image of the server
        await fs.unlink(req.file.path)
        res.status(200).send({status: 'OK'});
    });
}


async function getProducts(req, res) {
    const products = await Product.find();
    return res.status(200).send(products);
}

function getOneProduct(req, res) {
    const idPro = req.params.idPro;
    Product.findById(idPro, (err, value) => {
        if(err) return res.status(404).send({status: 'FAIL', message: 'Producto no encontrado'});
        return res.status(200).send(value);
    });
}

function updateStatus(req, res) {
    const idPro = req.params.idPro;
    const status = req.body.status;

    Product.findOneAndUpdate({_id: idPro}, {status}, (err, value) => {
        if(err) return res.status(422).send({status: 'FAIL', message: 'No se pudo actualizar el status'});
        return res.status(200).send({status: 'OK', message: 'Status actualizado'});
    });
}

// TODO: UPDATE PRODUCT
function updateProducto(req, res) {
    
}








module.exports = {
    createProduct,
    getProducts,
    getOneProduct,
    updateStatus
};









