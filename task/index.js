const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

//default/home route 
app.get('/', function(req, res){
    fs.readdir(`./files`, function(err, files){
        res.render("index", {files: files});
    })
})
//creation route(to write the task)
app.post('/create', function(req, res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){
        res.redirect("/")
    })
})
//show route(to read the task)
app.get('/file/:filename', function(req, res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata){
        res.render('show', {filename: req.params.filename, filedata: filedata});
    })
})
//edit route(to get the task)
app.get('/edit/:filename', function(req, res){
    res.render('edit', {filename: req.params.filename});
})
//edited show route(to change & post the filename)
app.post('/edit', function(req, res){
    fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function(err){
        res.redirect("/");
    })
})

app.listen(3000);