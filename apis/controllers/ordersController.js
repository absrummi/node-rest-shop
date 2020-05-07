const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

//get all orders
exports.get_all_orders = (req, res, next) => {

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


};

//get orders by id
exports.get_orders_by_id = (req, res, next) => {

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

};

//make an orders
exports.order_product_by_product_id = (req, res, next) => {

 
    const id = req.body.productID;
    Product.findById(id)
    .exec()
    .then(doc => {
        
        console.log(" OrderCson   "+ req.body.productID);
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            productID: req.body.productID,
            quantity: req.body.quantity
            });
    
         order
        .save()
        .then( result => {
            console.log(" OrdaserCon   "+ req.body.productID);
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



};

//delete order by its id
exports.delete_order_by_id = (req, res, next) => {

    res.status(200).json({
        message: 'Order deleted',
        orderID: req.params.orderID
    });

};