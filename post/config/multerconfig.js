const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

//diskstorage
const storage = multer.diskStorage({
    //location of file
    destination: function(req, file, cb){
        cb(null, "./public/images/uploads");
    },
    //setting the filename for file in the folder
    filename: function(req, file, cb){
        crypto.randomBytes(10, function(err, name){
            const fn = name.toString("hex")+path.extname(file.originalname);
        });
    }
});

//export upload variable
const upload = multer({storage: storage});

module.exports = upload;