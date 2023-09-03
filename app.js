//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');

const app = express();
app.set('view-engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://127.0.0.1:27017/userDB');
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt,{ secret:process.env.SECRET , encryptedFields:["password"] });
const User = mongoose.model("User",userSchema);

app.get("/",async(req,res)=>{
    res.render("home.ejs");
})
app.get("/login",async(req,res)=>{
    res.render("login.ejs");
})
app.get("/register",async(req,res)=>{
    res.render("register.ejs");
})
app.post("/register",async(req,res)=>{
    try{const newUser = new User ({
       email:req.body.username,
       password:req.body.password
    });
    newUser.save();
     res.render("secrets.ejs");}
    catch(err){
        console.log(err);
    }
})
app.post("/login",async(req,res)=>{
    try{const username = req.body.username;
    const password = req.body.password;
    const foundUser = await User.findOne({email:username});
    if (foundUser){
        if(foundUser.password === password){
            res.render("secrets.ejs");
        }
    }
    }
    catch(err){
        console.log(err);
    }
})



app.listen('3000',async(req,res)=>{
    console.log("Server hosted on port 3000");
})
