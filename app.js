//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/userDB",{ useUnifiedTopology : true, useNewUrlParser : true });

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});

userSchema.plugin(encrypt, {secret : process.env.SECRET, encryptedFields : ["password"]});

const User = mongoose.model("User",userSchema);

app.get("/",(req,res) => {
  res.render("home");
});

app.get("/login",(req,res) => {
  res.render("login");
});

app.get("/register",(req,res) => {
  res.render("register");
});

app.post("/register",(req,res) => {
  const newUser = new User ({
    email : req.body.username,
    password : req.body.password
  });

  newUser.save(function(err){
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.post("/login",(req,res) => {
  User.findOne({email : req.body.username},function(err,usercheck){
    if (usercheck) {
      if (usercheck.password === req.body.password){
        res.render("secrets");
      } else {
        console.log("Check Password");
      }
    } else {
      console.log("Check Username.");
    }
  });
});

app.listen(8000,function(){
  console.log("Server connected to port 8000")
});
