const express=require('express');
const router=express.Router();
const productModel = require('../models/product');
const path=require("path");
const Cart = require('../models/cart');

router.get('/shopping-cart', function(req, res,next){
    if(!req.session.cart){
        console.log("NO CART!");
        return res.render('cart/shopping-cart',{
            products: null
        })
    }
    
    var cart=new Cart(req.session.cart);
    res.render('cart/shopping-cart',{
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        tax: cart.tax,
        orderTotal: cart.orderTotal
    })
})

router.get('/thankyou',function(req, res, next){
    res.render('cart/thankyou');
})


module.exports=router;
