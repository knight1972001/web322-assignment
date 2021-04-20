const express=require('express');
const router=express.Router();
const database = require('../models/database');
const productModel = require('../models/product');
const path=require("path");
const Cart= require('../models/cart');


const dotenv=require('dotenv');
dotenv.config({path:"./config/keys.env"});

// Route to the default page (home page)
router.get("/", function(req, res){
    productModel.find()
    .exec()
    .then((data)=>{
        data=data.map(value=>value.toObject());
        function getAllCake(){
            let cakes=[];
            for(let i=0; i<data.length; i++){
                if(data[i].type=='cake'){
                    cakes.push(data[i]);
                }
            }
            return cakes;
        }

        function getAllPizza(){
            let pizza=[];
            for(let i=0;i<data.length; i++){
                if(data[i].type == 'pizza'){
                    pizza.push(data[i]);
                }
            }
            return pizza;
        }

        res.render("general/index",{
            hero: database.getHeroContent(), 
            cake: getAllCake(), 
            pizza: getAllPizza(),
            title: "MeuBakery"
        });
    });
});

//setup dashboard
router.get("/dashboard", function(req, res){
    var localUser=req.session.user;
    if(localUser){
        if(localUser.isAdmin){
            res.render("general/dashboard",{
                title: "Dashboard"
            });
        }else{
            res.status(404).render("404");
        }
    }else{
        res.status(404).render("404");
    }
});

//setup another route -> About route
router.get("/about", function(req, res){
    res.render("general/about",{
        title: "About"
    });
});

//CART
router.get('/add-to-cart/:id', function(req,res,next){
    var productId=req.params.id;
    var cart=new Cart(req.session.cart ? req.session.cart : {items:{}});

    productModel.findById(productId, function(err,product){
        if(err){
            return res.redirect('/');
        }
        cart.add(product,product.id);
        req.session.cart=cart;
        console.log(req.session.cart);
        res.redirect('/product/menu');
    });
});

router.get('/remove-from-cart/:id',function(req, res, next){
    var productId=req.params.id;
    var cart=new Cart(req.session.cart);
    productModel.findById(productId, function(err,product){
        if(err){
            return res.redirect('/');
        }
        cart.removeOne(product,product.id);
        req.session.cart=cart;
        console.log(req.session.cart);
        res.redirect('/cart/shopping-cart');
    });
});


router.get('/remove-all/:id',function(req, res, next){
    var productId=req.params.id;
    var cart=new Cart(req.session.cart);
    productModel.findById(productId, function(err,product){
        if(err){
            return res.redirect('/');
        }
        cart.removeAll(product,product.id);
        req.session.cart=cart;
        console.log(req.session.cart);
        res.redirect('/cart/shopping-cart');
    });
})

router.get('/checkout',function(req, res, next){
    req.session.cart=[];

    res.redirect('/cart/thankyou');
})
//CART

module.exports=router;
