const express  = require('express');
const app = express();
const cookieParser  = require('cookie-parser');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');
const path  = require('path');
const userModel  = require('./models/user');
const user = require('./models/user');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get("/",(req, res) => {
    // res.cookie("name", "rupesh");   //to set cookie
    // console.log(req.cookies);

    // bcrypt.genSalt(10, (err, salt) => {     //to hash / encrypt the password
    //     console.log(salt)                   //salt is random string
    //     bcrypt.hash("thisIsPassword", salt, (err, hash) => {
    //         console.log(hash)               //to store hash in your password DB & hash is encrypted password  
    //     })
    // })

    // //to compare password with encrypted password
    // bcrypt.compare("thisIsPassword", "thisIsHashedPassword", (err, result) => {
    //     console.log(result)        //result == true
    // })

    // let token = jwt.sign({email: "rupesh@gmail.com"}, "secretKey");   //to store the data on the server
    // res.cookie("token", token);     //to send the data to the backend(browser)
    res.render("index");
});

app.post("/create", async (req, res) => {
    let {name, email, image} = req.body;
    let createUser = await userModel.create({
        name, email, image
    })
    res.redirect("/read");
});

app.get("/read", async (req, res) => {
    let users = await userModel.find()
    res.render("read", {users});
});

app.get("/edit/:userid", async (req, res) => {
    let user = await userModel.findOne({_id: req.params.userid});
    res.render("edit",{user});
});

app.post("/update/:userid", async (req, res) => {
    let {name, email, image} = req.body;
    let user = await userModel.findOneAndUpdate({_id: req.params.userid}, {name, email, image}, {new: true});
    res.redirect("/read");
});

app.get("/delete/:id", async (req, res) => {
    let users = await userModel.findOneAndDelete({_id: req.params.id})
    res.redirect("/read");
});

app.listen(3000)
 