const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const productsRoutes = require('./apis/routes/products');
const ordersRoutes = require('./apis/routes/orders');
const usersRoutes = require('./apis/routes/users');

mongoose.connect('mongodb://localhost:27017/rest-api-shop',{
    useNewUrlParser: true
});

app.use(morgan('dev'));
app.use('/upload',express.static('upload'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);

//What if no route handle the incoming request? Then

app.use((req, res, next) => {
    const error = new Error('Page not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(404).json({
        error: {
            message: error.message
        }
    });
}); 

module.exports = app;