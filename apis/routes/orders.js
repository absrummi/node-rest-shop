const express = require('express');
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middlewares/check-auth');
const ordersController = require('../controllers/ordersController');

const Router = express.Router();

Router.get('/', checkAuth, ordersController.get_all_orders );

Router.get('/:orderID', checkAuth, ordersController.get_orders_by_id );

Router.post('/', checkAuth, ordersController.order_product_by_product_id);

Router.delete('/:orderID', checkAuth, ordersController.delete_order_by_id);

module.exports = Router;