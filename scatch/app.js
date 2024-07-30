const express  = require('express');
const app = express();
const cookieParser  = require('cookie-parser');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');
const path  = require('path');
const crypto = require('crypto'); 
const upload = require('./config/multerconfig'); 
const multer = require('multer'); 

app.set('view engine','ejs'); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get("/",(req, res) => {                                                 //to send the data to the backend(browser) / to set token(cookie) on the frontend
    res.render("index");
});


app.listen(3000);  
  