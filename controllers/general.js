const express=require('express');
const router=express.Router();
const sendgridMail=require('@sendgrid/mail');
const database = require('../models/database');

const dotenv=require('dotenv');
dotenv.config({path:"./config/keys.env"});

router.get("/", function(req, res){
    res.render("general/index",{
        hero: database.getHeroContent(), 
        cake: database.getAllCake(), 
        pizza: database.getAllPizza(),
        title: "MeuBakery"
    });
});

//setup another route -> About route
router.get("/about", function(req, res){
    res.render("general/about",{
        title: "About"
    });
});


router.get("/login", function(req, res){
    res.render("general/login", {
        title: "Login"
    });
});

router.get("/register", function(req, res){
    res.render("general/register", {
        title: "Register"
    });
});

router.post("/login", function(req, res){
    let validationResults={};
    let passedValidation=true;

    const {firstName, lastName, email, password}=req.body;

    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(email.length < 2){
        validationResults.email = "The email must be more than 2 characters!";
        passedValidation=false;
    }else if(!emailRegex.test(email)){
        validationResults.email = "Incorrect email form";
        passedValidation=false;
    }

    const passwordRegex = /(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/g;
    if(typeof password !== "string" || password.length < 6 || password.length > 12){
        console.log(typeof password);
        validationResults.password = "Password must between 6 to 12 characters"
        passedValidation=false;
    }else if(!passwordRegex.test(password)) {
        validationResults.password = "Password must contains at least one lowercase letter, uppercase letter, number and symbol!"
        passedValidation=false;
    }

    if(passedValidation){
        res.render("general/index",{
            hero: database.getHeroContent(), 
            cake: database.getAllCake(), 
            pizza: database.getAllPizza(),
            title: "MeuBakery",
            values: req.body
        });
    }else{
        res.render("general/login",{
            title: "Login",
            validationResults: validationResults,
            values: req.body
        });
    }
});

router.post("/register", function(req, res){
    
    let validationResults={};
    let passedValidation=true;

    const {firstName, lastName, email, password}=req.body;

    const nameRegex=/(?=.*?[=[#?!@$%^&*-])/g;
    if(firstName.length < 2){
        validationResults.firstName="The first name must be more than 2 characters!";
        passedValidation=false;
    }else if(nameRegex.test(firstName)){
        validationResults.firstName="The first name must not contain special character!";
        passedValidation=false;
    }

    if(lastName.length < 2){
        validationResults.firstName="The last name must be more than 2 characters!";
        passedValidation=false;
    }else if(nameRegex.test(lastName)){
        validationResults.firstName="The last name must not contain special character!";
        passedValidation=false;
    }
    
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(email.length < 2){
        validationResults.email = "The email must be more than 2 characters!";
        passedValidation=false;
    }else if(!emailRegex.test(email)){
        validationResults.email = "Incorrect email form";
        passedValidation=false;
    }

    const passwordRegex = /(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/g;
    if(typeof password !== "string" || password.length < 6 || password.length > 12){
        console.log(typeof password);
        validationResults.password = "Password must between 6 to 12 characters"
        passedValidation=false;
    }else if(!passwordRegex.test(password)) {
        validationResults.password = "Password must contains at least one lowercase letter, uppercase letter, number and symbol!"
        passedValidation=false;
    }

    if(passedValidation){
        sendgridMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const msg={
            to: email,
            from: "lnguyen97@myseneca.ca",
            subject: "Welcome to our bakery",
            html:
                `Hello ${firstName} ${lastName},<br>
                This website made by Long Nguyen<br>
                Website: `
        };

        sendgridMail.send(msg).then(()=>{
            res.render("general/index",{
                hero: database.getHeroContent(), 
                cake: database.getAllCake(), 
                pizza: database.getAllPizza(),
                title: "MeuBakery",
                values: req.body
            });
        }).catch(err=>{
            console.log(`Error ${err}`);
            res.send("Error");
        });
    }else{
        res.render("general/register",{
            title: "Register",
            validationResults: validationResults,
            values: req.body
        });
    }
});


module.exports=router;
