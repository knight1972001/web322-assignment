const mongoose = require('mongoose');
const Schema=mongoose.Schema;

//Define new product schema
const productSchema = new Schema({
    productImg: String,
    title:{
        type: String,
        require: true
    },description: {
        type: String,
        require: true
    },price:{
        type: Number,
        require: true
    },type:{
        type: String,
        require: true
    },date:{
        type: Date,
        default: Date.now()
    }
});

const productModel=mongoose.model("Products", productSchema);

module.exports=productModel;