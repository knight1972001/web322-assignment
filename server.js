/************************************************************************************
* WEB322 – Assignment 1 (Winter 2021)
* I declare that this assignment is my own work in accordance with Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Name:			LONG NGUYEN
* Student ID:	155176183
* Course:		WEB322NCC
*
************************************************************************************/
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser=require('body-parser');
const dotenv=require('dotenv');
const session = require('express-session');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');


const path = require('path');
//set up dotenv environment variables
dotenv.config({path:"./config/keys.env"});


//setup express
const app = express();

//set up body parser
app.use(bodyParser.urlencoded({extended:false}));

app.use(fileUpload());
app.use(express.static("static"));
app.use(express.static(__dirname + "/public"));

//setup handlebars
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');

//setup hdb helpers
var Handlebars=require('handlebars');
Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
  });

//setup express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use((req,res,next)=>{
    //res.locals.user is a global hdb variable
    //this means that ever single hdb file can access that user variable!
    res.locals.user=req.session.user;
    res.locals.session=req.session;
    next();
});

//Setup Route, load controllers into express
const generalController = require("./controllers/general");
app.use("/", generalController);

const productController = require("./controllers/product");
app.use("/product", productController);

const userController = require("./controllers/user");
app.use("/user",userController);

const loadDataController=require("./controllers/load-data");
app.use("/loadData",loadDataController);

const cartController = require("./controllers/cart");
app.use("/cart", cartController);

app.use((req, res) =>{
    res.status(404).render("404")
});

app.use(function (err, req, res, next){
    console.error(err.stack)
    res.status(500).send("Something broke!");
});


// Setup and connect mongodb
mongoose.connect(process.env.MONGO_DB_CONNECTION_KEY,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log("Connected to the MongoDB database.");
}).catch((err)=>{
    console.log(`Error: ${err}`);
});

//Start up express web server
const PORT = process.env.PORT;

function onHttpStart(){
    console.log(`Express http start on port ${PORT}`);
}

//setup http server to listen on HTTP port
app.listen(PORT, onHttpStart);
