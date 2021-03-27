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

//setup router for add/remove product
router.get("/management", function(req, res){
    var localUser=req.session.user;
    if(localUser){
        if(localUser.isAdmin){
        productModel.find()
        .exec()
        .then((data)=>{
            data=data.map(value=>value.toObject());
    
            res.render("product/management", {
                data: data,
                title: "Product Management"
            });
        });
        }else{
            res.status(404).render("404");
        }
    }else{
        res.status(404).render("404");
    }
    
});

router.post("/addProduct", (req, res)=>{
    var newProduct=new productModel({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,
    });

    newProduct.save()
    .then((productSaved)=>{
        console.log(`Product ${productSaved.title} has been saved to the database.`);

        if(req.files){
            //Rename the file name to unique
        req.files.productImg.name=`product_pic_${productSaved.id}${path.parse(req.files.productImg.name).ext}`;
        
        //copy the image to a file in "public/uploads"
        req.files.productImg.mv(`public/uploads/${req.files.productImg.name}`)
        .then(()=>{
            productModel.updateOne({
                _id: productSaved._id
            },{
                productImg: req.files.productImg.name
            })
            .then(()=>{
                console.log("product was updated with the product pic file name.");
            });
        })
        }else{
            console.log("Added product without Img");
        }
    })
    .catch((error)=>{
        console.log(`Error adding prodcut to the dbs: ${error}`);
    });
    res.redirect("/product/management");
});

//define update Product Router
router.post("/updateProduct", (req, res)=>{
    if(req.body.update == "delete"){
        productModel.deleteOne({
            _id: req.body._id
        })
        .exec()
        .then(()=>{
            console.log("Successfully remove product: "+req.body._id);
        }).catch((error)=>{
            console.log("Error: "+error);
        });
    }else{
            productModel.updateOne({
                _id: req.body._id
            },{
                $set:{
                    title: req.body.title,
                    description: req.body.description,
                    price: req.body.price,
                    type: req.body.type
                }
            })  
            .exec()
            .then(()=>{
                console.log("Successfully update product: "+req.body._id);
            }).catch((err)=>{
                console.log(`Error adding prodcut to the dbs: ${err}`);
            });

            if(req.files){
                req.files.productImg.name=`product_pic_${req.body.id}${path.parse(req.files.productImg.name).ext}`;
        
                //copy the image to a file in "public/uploads"
                req.files.productImg.mv(`public/uploads/${req.files.productImg.name}`)
                .then(()=>{
                    productModel.updateOne({
                        _id: req.body._id
                    },{
                        productImg: req.files.productImg.name
                    })
                    .then(()=>{
                        console.log("product was updated with the product pic file name.");
                    });
                })
            }
        }
        res.redirect("/product/management");
    })

module.exports=router;
