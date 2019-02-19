const express = require('express');
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

const Router = express.Router();

Router.get('/', (req, res, next) => {

    Order
    .find()
    .select('_id quantity productID')
    .exec()
    .then( doc => {
        res.status(200).json({
            Count: doc.length,
            result: doc
        })
    })
    .catch( err => {
        res.status(500).json({
            Error: err
        })
    });


});

Router.get('/:orderID', (req, res, next) => {

    Order
    .findById(req.params.orderID)
    .select('_id quantity productID')
    .exec()
    .then( doc => {
        res.status(200).json({
            Order: doc,
            request: {
                type: "GET",
                url: "http://localhost:3000/orders"+req.url.orderID
            }
        })
    })
    .catch( err => {
        res.status(500).json({
            Error: err
        })
    });

});

Router.post('/:orderID', (req, res, next) => {


    Product.findById({_id: req.body.productID})
    .exec()
    .then(doc => {
        

        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            productID: req.body.productID,
            quantity: req.body.quantity
            });
    
        order
        .save()
        .then( result => {
            res.status(200).json({
                message: "Sale save",
                order: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error catched"
            })
        });



    })
    .catch(err => {
        res.status(404).json({
            Error: "Product for this ID : "+ req.body.productID + " doesn't exists"
        })
    });



});

Router.delete('/:orderID', (req, res, next) => {

    res.status(200).json({
        message: 'Order deleted',
        orderID: req.params.orderID
    });

});

module.exports = Router;