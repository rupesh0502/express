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
    res.render("app");
});

app.listen(3000, function(){
    console.log("it is running");
});
