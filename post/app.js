const express  = require('express');
const app = express();
const cookieParser  = require('cookie-parser');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');
const path  = require('path');
const userModel  = require('./models/user');
const postModel  = require('./models/post');
const crypto = require('crypto'); 
const upload = require('./config/multerconfig'); 
const multer = require('multer'); 

app.set('view engine','ejs'); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// const storage = multer.diskStorage({ 
//     destination: function(req, file, cb){
//         cb(null, './public/images/uploads');
//     },
//     filename: function(req, file, cb){
//         crypto.randomBytes(10, function(err, bytes){
//             const fn = bytes.toString("hex") + path.extname(file.originalname);
//             cb(null, fn);
//         });
//     }
// });
// const upload = multer({storage: storage}); 

app.get("/",(req, res) => {                                                 //to send the data to the backend(browser) / to set token(cookie) on the frontend
    res.render("index");
});

app.post("/register", async (req, res) => {
    let { username, name, email, password, age } = req.body;

    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("User already registered");

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username, name, email, age, password:hash,
            });
            let token = jwt.sign({email: email, userid:user._id}, "secreateKey");
            res.cookie("token", token);
            res.send("Registered Successfully...!")
        });
    });
});

app.get("/login", function (req, res) {       
    res.render("login");
});

app.post("/login", async function (req, res) {
    let { email, password } = req.body;
    
    let user = await userModel.findOne({email});                                      //to find email with user email for varification
    console.log(user);                                                                //to display the on the terminal 
    if(!user) return res.status(500).send("Something went wrong...");                 //if user not found
    
    bcrypt.compare(password, user.password, function(err, result){                    //to compare the user password with server(browser)
        // if(result) res.status(200).send("You can login...")
        if(result) {
            let token = jwt.sign({email: email, userid: user._id}, "secreateKey");    //to compare the eamil and user email with token 
            res.cookie("token",token);                                                //to save(set) password(token) on user's browser
            res.status(200).redirect("/profile")                                      //if password match then user will be login
        }
        // else res.send("Something went wrong...");
        else res.redirect("/login");                                                  //else user will not login 
    });
});

app.get("/logout", function (req, res) { 
    res.cookie("token", "");                                                    //to remove cookie from browser                                      // when we loged out then this cookie(token) removes from browser amnd we loged out
    res.redirect("/login");                                                     //and redirect to login
});

app.get("/profile", isLoggedIn, async (req, res) => { 
    let user = await userModel.findOne({email: req.user.email}).populate("posts");                                         //to get data from usermode and display on the profile page  
    res.render("profile", {user});                                                     
});

app.post("/post", isLoggedIn, async (req, res) => { 
    let user = await userModel.findOne({email: req.user.email});
    let {content} = req.body;

    let post = await postModel.create({user: user._id, content});
    user.posts.push(post._id);   
    await user.save();
    res.redirect("/profile");                                               //and redirect to login
});

app.get("/like/:id", isLoggedIn, async (req, res) => { 
    let post = await postModel.findOne({_id: req.params.id}).populate("user");                                         //to get data from usermode and display on the profile page  
    
    if(post.likes.indexOf(req.user.userid) === -1){
        post.likes.push(req.user.userid);
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }
    await post.save();
    res.redirect("/profile");                                                     
});

app.get("/edit/:id", isLoggedIn, async (req, res) => { 
    let post = await postModel.findOne({_id: req.params.id}).populate("user");                                         //to get data from usermode and display on the profile page  

    res.render("edit", {post});                                                     
});

app.post("/update/:id", isLoggedIn, async (req, res) => { 
    let post = await postModel.findOneAndUpdate({_id: req.params.id}, {content: req.body.content});                                         //to get data from usermode and display on the profile page  
    res.redirect("/profile");                                                     
});

app.get("/profile/upload", (req, res) => {                                                 //to send the data to the backend(browser) / to set token(cookie) on the frontend
    res.render("profileupload");
}); 

app.post("/upload", isLoggedIn, upload.single("image") , async (req, res) => {                                                 //to send the data to the backend(browser) / to set token(cookie) on the frontend
    let user = await userModel.findOne({email: req.user.email});
    user.profilepic = req.file.filename;
    await user.save();
    res.redirect("/profile");
    // console.log(req.file)
});

function isLoggedIn(req, res, next){
    if(req.cookies.token === "") res.redirect("/login");
    else{
        let data = jwt.verify(req.cookies.token, "secreateKey");
        req.user = data;
        next();
    }
}

app.listen(3000);  
  