const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Please enter product name'] },
    type: {
        type: String,
        required: [true, 'Please select product type'],
        enum: ['Foods', 'Electronics', 'Clothes', 'Beauty Products', 'Others']
    },
    stock: { type: Number, required: [true, 'Please enter stock quantity'] },
    mrp: { type: Number, required: [true, 'Please enter MRP'] },
    sellingPrice: { type: Number, required: [true, 'Please enter selling price'] },
    brand: { type: String, required: [true, 'Please enter brand name'] },
    images: [{ type: String }], // Array of Base64 strings or URLs
    exchangeEligible: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'Yes'
    },
    isPublished: { type: Boolean, default: false }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.virtual('totalImages').get(function () {
    return this.images ? this.images.length : 0;
});

module.exports = mongoose.model('Product', productSchema);
