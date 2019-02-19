const express = require('express');
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'upload/')
    },

    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
    
    
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter

        });

const Router = express.Router();

Router.get('/', (req, res, next)=>{

    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        const responseObj = {
            count: doc.length,
            products: doc.map(doc => {
                return{
                    name: doc.name,
                    price: doc.price,
                    _id: doc.id,
                    productImage: doc.productImage,
                    request: {
                        type: "GET",
                        url: "http://localhost/products/"+doc.id
                    }
                }
            })
        }
        res.status(200).json(responseObj);
    })
    .catch( err => {
        res.status(500).json({
            error: err.message
        });
    });
    
});

Router.post('/:productID', upload.single('productImage'), (req, res, next)=>{
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    
    product
    // .select('name price _id productImage')
    .save()
    .then(result => {
            res.status(201).json({
            message: 'Product created',
            createdProduct: product
        });

    })
    .catch(err => {
        res.status(500).json({Error: err.message});
    })


});

Router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    
    Product.findById(id)
    .exec()
    .then(doc =>{
        console.log(doc);
        
        if(doc)
        {
            res.status(200).json(doc);
        }
        else{
            res.status(404).json({Error: 'Not exist any data for given Product-ID : '+id})
        }
    })
    .catch(err => {
        console.log(err.message);
        res.status(500).json({
            error: err
        });
    });
});

Router.patch('/:productID', (req, res, next) => {
    const id = req.params.productID;
    const updateOps = {};
    for(const ops of req.body){
        
           updateOps[ops.propName]= ops.value;
        
    }

    Product.update({_id: id},{$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(404).json({
            Error: "Not updated"
        })
    });
    
});

Router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product
    .remove({_id: id})
    .exec()
    .then( doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({Error: ' The targetted product couldn"t be removed Product-ID : '+id});
    });
})

module.exports = Router;