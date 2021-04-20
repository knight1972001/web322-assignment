const express=require('express');
const router=express.Router();
const productModel = require('../models/product');
const path=require("path");

router.get("/menu", function(req, res){
    productModel.find()
    .exec()
    .then((data)=>{
        data=data.map(value=>value.toObject());
        res.render("product/menu", {
            allProduct: data, 
            title: "Menu"
        });
    })
});

module.exports=findProduct=(id)=>{
    productModel.findOne({
        _id: id
    }).then((data)=>{
        if(data){
            data=data.map(value=>value.toObject());
            return data;
        }else{
            return false;
        }
    });
}

module.exports=router;
