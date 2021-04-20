const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const Schema=mongoose.Schema;

// Define the user schema
const userSchema=new Schema({
    firstName: {
        type: String,
        required: true
    },lastName: {
        type: String,
        required: true
    },email: {
        type: String,
        required: true
    },password: {
        type: String,
        required: true,
        unique: true
    },date:{
        type: Date,
        default: Date.now()
    },isAdmin: {
        type: Boolean,
        default: false
    },shoppingCart: {
        productId: String,
        productName: String,
        quantity: Number,
    }
});

//encrypt password
userSchema.pre("save",function(next){
    var user=this;

    //Generate the unique salt
    bcrypt.genSalt(10).then((salt)=>{
        //hash password
        bcrypt.hash(user.password,salt).then((encryptedPwd)=>{
            user.password=encryptedPwd;
            next();
        }).catch((error)=>{
            console.log(`Error when trying hashing: ${error}`);
        })
    }).catch((error)=>{
        console.log(`Error when trying salting: ${error}`);
    })
})

const userModel=mongoose.model("Users", userSchema);

module.exports = userModel;