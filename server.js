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
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser=require('body-parser');

const dotenv=require('dotenv');
dotenv.config({path:"./config/keys.env"});

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static("static"));
app.use(express.static(__dirname + "/public"));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
}));
app.set('view engine', '.hbs');


//load controllers into express
const generalController = require("./controllers/general");
const productController = require("./controllers/product");

app.use("/", generalController);
app.use("/product", productController);

app.use((req, res) =>{
    res.status(404).render("404")
});

app.use(function (err, req, res, next){
    console.error(err.stack)
    res.status(500).send("Something broke!");
});


const PORT = process.env.PORT;

function onHttpStart(){
    console.log(`Express http start on port ${PORT}`);
}

//setup http server to listen on HTTP port
app.listen(PORT, onHttpStart);
