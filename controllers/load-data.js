const express=require('express');
const router=express.Router();
const productModel = require('../models/product');
const path=require("path");


//setup router for add/remove product
router.get("/managementProduct", function(req, res){
    var localUser=req.session.user;
    if(localUser){
        if(localUser.isAdmin){
        productModel.find()
        .exec()
        .then((data)=>{
            data=data.map(value=>value.toObject());
            
            res.render("loadData/managementProduct", {
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
    var errors={};

    productModel.findOne({
        title: req.body.title
    }).then((product)=>{
        if(product){
            errors.dataexist="This product already exists!";
        }else{
            if(req.files){
                var ext=`${path.parse(req.files.productImg.name).ext}`;
                console.log("Ext:"+ext);
                if(ext==".jpg"||ext==".png"){
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
                }else{
                    errors.img="It is not Image!";
                }
            }
        }
    });

    productModel.find()
    .exec()
    .then((data)=>{
        data=data.map(value=>value.toObject());
        
        res.render("loadData/managementProduct", {
            data: data,
            title: "Product Management",
            error: errors
        });
    });
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
        res.redirect("/loadData/managementProduct");
    })




    //USER
    const bcrypt= require('bcryptjs');
    const userModel = require('../models/user');
    const sendgridMail=require('@sendgrid/mail');
    //setup router for add/remove product

    router.get("/managementUser", function(req, res){
    var localUser=req.session.user;
    if(localUser){
        if(localUser.isAdmin){
        userModel.find()
        .exec()
        .then((data)=>{
            data=data.map(value=>value.toObject());
    
            res.render("loadData/managementUser", {
                data: data,
                title: "User Management"
            });
        });
        }else{
            res.status(404).render("404");
        }
    }else{
        res.status(404).render("404");
    }
    
});

router.post("/updateUser", (req, res) => {
    if(req.body.update == "delete"){
        userModel.deleteOne({
            _id: req.body._id
        })
        .exec()
        .then(()=>{
            console.log("Successfully remove user: "+req.body._id);
            res.redirect("/loadData/managementUser");
        }).catch((error)=>{
            console.log("Error: "+error);
        });;
    }else{
        var convertIsAdminToBool;
        if(req.body.isAdmin == "admin"){
            convertIsAdminToBool=true;
        }else if(req.body.isAdmin == "client"){
            convertIsAdminToBool=false;
        }

        var password_encrypted=req.body.password;
        //Generate the unique salt
        bcrypt.genSalt(10).then((salt)=>{
            //hash password
            bcrypt.hash(req.body.password,salt).then((encryptedPwd)=>{
                password_encrypted=encryptedPwd;
                userModel.updateOne({
                    _id: req.body._id
                },{
                    $set:{
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: password_encrypted,
                        isAdmin: convertIsAdminToBool
                    }
                })  
                .exec()
                .then(()=>{
                    console.log("Successfully update user: "+req.body._id);
                }).catch((err)=>{
                    console.log(`Error adding prodcut to the dbs: ${err}`);
                });
            }).catch((error)=>{
                console.log(`Error when trying hashing: ${error}`);
            })
        }).catch((error)=>{
            console.log(`Error when trying salting: ${error}`);
        })

        
    }
})

module.exports=router;