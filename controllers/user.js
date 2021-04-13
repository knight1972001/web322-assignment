const express = require('express');
const bcrypt= require('bcryptjs');
const userModel = require('../models/user');
const sendgridMail=require('@sendgrid/mail');
const e = require('express');
const router = express.Router();


//Setup registration page
router.get("/register", (req, res) => {
    res.render("user/register",{
        title: "Register"
    })
});

router.post("/register",(req, res)=>{
    //validation Input
    let validationResults={};
    let passedValidation=true;

    const {firstName, lastName, email, password, isAdmin}=req.body;

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
    if(typeof password !== "string" || password.length < 6){
        console.log(typeof password);
        validationResults.password = "Password must be more than 6 characters!";
        passedValidation=false;
    }else if(!passwordRegex.test(password)) {
        validationResults.password = "Password must contains at least one lowercase letter, uppercase letter, number and symbol!"
        passedValidation=false;
    }

    var convertIsAdminToBool;
    if(isAdmin != "admin"&&isAdmin != "client"){
        validationResults.radio="Please select user type!";
        passedValidation=false;
    }else{
        if(isAdmin == "admin"){
            convertIsAdminToBool=true;
        }else if(isAdmin == "client"){
            convertIsAdminToBool=false;
        }
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
                Welcome!`
        };
        sendgridMail.send(msg).then(()=>{
            
            userModel.findOne({
                email: req.body.email
            }).then((user)=>{
                if(user){
                    validationResults.dataexist = "This email was registered! Use another email!";
                    passedValidation=false;

                    res.render("user/register",{
                        title: "Register",
                        validationResults: validationResults,
                        values: req.body
                    });
                }else{
                    const user = new userModel({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: req.body.password,
                        isAdmin: convertIsAdminToBool
                    });
                    user.save().
                    then((userSaved)=>{
                        console.log(`User ${userSaved.firstName} has been registered and isAdmin: ` + convertIsAdminToBool);
                        req.session.user=userSaved;
                        res.redirect("/");
                    }).catch((error)=>{
                        console.log(`User cannot register due to error: ${error}`);
                        res.redirect("/");
                    });
                }
            });
        }).catch(err=>{
            console.log(`Error ${err}`);
            res.send("Error");
        });
    }else{
        res.render("user/register",{
            title: "Register",
            validationResults: validationResults,
            values: req.body
        });
    }
});

//Setup login page
router.get("/login", (req, res)=>{
    res.render("user/login");
});

router.post("/login", (req, res)=>{
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
    if(typeof password !== "string" || password.length < 6){
        console.log(typeof password);
        validationResults.password = "Password must be more than 6 characters!"
        passedValidation=false;
    }else if(!passwordRegex.test(password)) {
        validationResults.password = "Password must contains at least one lowercase letter, uppercase letter, number and symbol!"
        passedValidation=false;
    }

    if(passedValidation){
        let errors=[];

        userModel.findOne({
            email: req.body.email
        }).then((user)=>{
            if(user){
                //User was found, compare password in dbs(hashed)
                bcrypt.compare(req.body.password, user.password)
                .then((isMatched)=>{
                    if(isMatched){
                        //matched password
                        //create a new session and set the user to "User" object returned from DB.
                        req.session.user=user;
                        if(user.isAdmin){
                            res.redirect("/dashboard");
                        }else{
                            res.redirect("/");
                        }
                    }else{
                        //unmatched password
                        errors.push("Wrong password!, check your password again!");
                        res.render("user/login",{
                            title: "Login",
                            validationResults: validationResults,
                            values: req.body,
                            errors
                        });
                    }
                }).catch((err)=>{
                    console.log(`${error} finding the user!`);
                    errors.push("Oops, Something wrong!");
                    res.render("user/login",{
                        title: "Login",
                        validationResults: validationResults,
                        values: req.body,
                        errors
                    });
                });
            }else{
                //User was not found!
                errors.push("Sorry, your email was not found!");
                res.render("user/login",{
                    title: "Login",
                    validationResults: validationResults,
                    values: req.body,
                    errors
                });
            }
        }).catch((error)=>{
            console.log(`${error} finding the user!`);
            errors.push("Oops, Something wrong!");
            res.render("user/login",{
                title: "Login",
                validationResults: validationResults,
                values: req.body,
                errors
            });
        });
    }else{
        console.log("went to else");
        res.render("user/login",{
            title: "Login",
            validationResults: validationResults,
            values: req.body
        });
    }
});

//setup logout page
router.get("/logout",(req, res)=>{
    //clear the seassion
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;