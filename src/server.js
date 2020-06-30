const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mime = require('mime');
const cors = require('cors');

const app = express();

if(process.env.NODE_ENV == 'development') {
    require('dotenv').config();
}

require('./database');


// Settings

const setHeadersOnStatic = (res, path, stat) => {
    const mimeType = mime.getType(path);
    res.set('content-type', mimeType);
}
const staticOptions = {
    setHeaders: setHeadersOnStatic
};

app.use(express.static(path.join(__dirname + '/public'), staticOptions));
app.set('port', process.env.PORT || 4000);
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(morgan('dev'));
app.use(cors());




// Routes
app.use('/user', require('./routes/userRoutes'));
app.use('/product', require('./routes/productRoutes'));


// Server Listening
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
})