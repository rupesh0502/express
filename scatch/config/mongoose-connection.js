const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development:mongoose")

mongoose
.connect(`${config.get("MONGODB_URI")}/scatch`)
.then(function(){
    dbgr("connected")
})
.catch(function(err){
    console.log(err)
});

module.exports = mongoose.connection;

// to add env setup -> $env:NODE_ENV="development"
// to add env setup -> $env:DEBUG="development:*"
// to remove the env setup --->  $env:DEBUG=""  