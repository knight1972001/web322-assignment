const express=require('express');
const router=express.Router();
const database = require('../models/database');


router.get("/menu", function(req, res){
    res.render("product/menu", {
        allProduct: database.getAllProducts(), 
        title: "Menu"
    });
});

module.exports=router;
