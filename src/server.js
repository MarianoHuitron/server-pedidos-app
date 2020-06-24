const express = require('express');
const app = express();

require('dotenv').config();
require('./database');


// Settings
app.set('port', process.env.PORT || 4000);


// Routes
app.use('/user', require('./routes/userRoutes'));


// Server Listening
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
})