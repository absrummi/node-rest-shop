const express = require('express');
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middlewares/check-auth');
const productsController = require('../controllers/productsController');

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

Router.get('/', productsController.get_all_products);

Router.post('/:productID', checkAuth, upload.single('productImage'), productsController.save_product);

Router.get('/:productID', productsController. get_product_by_id);

Router.patch('/:productID', checkAuth, productsController.update_product_by_id );

Router.delete('/:productID', checkAuth, productsController.delete_product_by_id);

module.exports = Router;