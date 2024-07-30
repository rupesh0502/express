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
    // res.cookie("name", "rupesh");                                               //to set cookie
    // console.log(req.cookies);

    // bcrypt.genSalt(10, (err, salt) => {                                         //to hash / encrypt the password
    //     console.log(salt)                                                       //salt is random string
    //     bcrypt.hash("thisIsPassword", salt, (err, hash) => {
    //         console.log(hash)                                                   //to store hash in your password DB & hash is encrypted password  
    //     })
    // })

    // bcrypt.compare("thisIsPassword", "thisIsHashedPassword", (err, result) => { //to compare password with encrypted password
    //     console.log(result)                                                     //result == true
    // })

    // let token = jwt.sign({email: "rupesh@gmail.com"}, "secretKey");             //to store the data on the server(to compare with user )
    // res.cookie("token", token);                                                 //to send the data to the backend(browser) / to set token(cookie) on the frontend
    res.render("index");
});

app.post("/create", (req, res) => {
    let {username, email, password, age} = req.body;                               //to create user info 

    bcrypt.genSalt(10, (err, salt) => {                
        bcrypt.hash(password, salt, async (err, hash) => {
            let createdUser = await userModel.create({
                username, email, password: hash, age
            })
            let token = jwt.sign({email}, "screateKey");
            res.cookie("token",token);
            res.send(createdUser);              
        })
    })
    // res.redirect("/read");
});

app.get("/login", function (req, res) {       
    res.render("login");
});

app.post("/login", async function (req, res) {
    let user = await userModel.findOne({email: req.body.email});                //to find email with user email for varification
    console.log(user);                                                          //to display the on the terminal 
    if(!user) return res.send("Something went wrong...");                       //if user not found
    bcrypt.compare(req.body.password, user.password, function(err, result){     //to compare the user password with server(browser)
        if(result){
            let token = jwt.sign({email: user.email}, "screateKey");            //to compare the eamil and user email with token 
            res.cookie("token",token);                                           //to save(set) password(token) on user's browser
            res.send("Login Successfull...!");                                     //if password match then user will be login
        }
        else res.send("Something went wrong...");                               //else user will not login 
    })
    // res.redirect("/"); 
});

app.get("/logout", function (req, res) { 
    res.cookie("token", "");                                                    // when we loged out then this cookie(token) removes from browser amnd we loged out
    res.redirect("/");
});

// app.get("/edit/:userid", async (req, res) => {
//     let user = await userModel.findOne({_id: req.params.userid});
//     res.render("edit",{user});
// });

// app.post("/update/:userid", async (req, res) => {
//     let {name, email, image} = req.body;
//     let user = await userModel.findOneAndUpdate({_id: req.params.userid}, {name, email, image}, {new: true});
//     res.redirect("/read");
// });

// app.get("/delete/:id", async (req, res) => {
//     let users = await userModel.findOneAndDelete({_id: req.params.id})
//     res.redirect("/read");
// });

app.listen(3000)
 