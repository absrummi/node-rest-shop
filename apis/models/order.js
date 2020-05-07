const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', requried: true},
    quantity: {type: Number, default: 1}
});

module.exports = mongoose.model('Orders', productSchema);
