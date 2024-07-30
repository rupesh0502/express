const express  = require('express');                //to get express from npm(express)
const app = express();                              //to fetch all data in app word
const cookieParser  = require('cookie-parser');     //to create cookie from npm(cookie-parser)
const bcrypt  = require('bcrypt');                  //to encrypt the password
const jwt = require('jsonwebtoken');                //to store the data on the server
const path  = require('path');                      //to get path 
const userModel  = require('./models/user');        //to get models from database
const user = require('./models/user');              //to get user from database

app.set('view engine','ejs');                              //to render ejs pages
app.use(express.json());                                   //to use & handle data to the backend 
app.use(express.urlencoded({extended: true}));             //to encode the url
app.use(express.static(path.join(__dirname, 'public')));   //to use & handle data of static, public and handle files etc
app.use(cookieParser());                                   //to use cookieParser method from cookie-parser

//route to display the pages on frontend
app.get("/",(req, res) => {
    res.cookie("name", "rupesh");           //to set cookie
    console.log(req.cookies);               //to get cookie on the backend(terminal)

    bcrypt.genSalt(10, (err, salt) => {     //to hash / encrypt the password
        console.log(salt)                   //salt is random string
        bcrypt.hash("thisIsPassword", salt, (err, hash) => {
            console.log(hash)               //to store hash in your password DB & hash is encrypted password
        });
    });

    //to compare password with encrypted password
    bcrypt.compare("thisIsPassword", "thisIsHashedPassword", (err, result) => {
        console.log(result)        //result == true
    })

    let token = jwt.sign({email: "rupesh@gmail.com"}, "secretKey")   //to store the data on the server
    res.cookie("token", token)      //to send the data to the backend(browser)
    res.render("index");
});

app.get("/profile/:username", function(req, res){
    res.send(`welcome, ${req.params.username}`);
    console.log(req.cookies.token);      //to get the data from the backend(browser)
    let data = jwt.verify(req.cookies.token, "screteKey");  //to get the data from the backend(browser)
    console.log(data)
});

app.get("/profile/:username/:age", function(req, res){
    res.send(`welcome, ${req.params.username} of age ${req.params.age}`);
});

app.listen(3000, function(){
    console.log("it is running");
})

// console.log(__dirname);