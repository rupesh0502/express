const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");

// to add env setup -> $env:NODE_ENV="development"
// to add env setup -> $env:DEBUG="development:*"
// to remove the env setup --->  $env:DEBUG="" 

// console.log(process.env.NODE_ENV);   // to add the env is in develipment  

if(process.env.NODE_ENV === "development"){
    router.post("/create", async function(req, res){
        let owners = await ownerModel.find();
        if(owners.length > 0){
            return res.status(503).send("You don't have permission to create any owner")
        } 

        let {fullname, email, password } = req.body;

        let createdOwner = await ownerModel.create({
            fullname, email, password });
        res.status(201).send(createdOwner);
    });
}

router.get("/", function(req, res){
   res.send("hey");
});

module.exports = router; 