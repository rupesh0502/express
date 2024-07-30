const mongoose = require('mongoose');

// mongoose.connect(`localhost/mongopractice`)
// mongoose.connect(`mongodb://127.0.0.1:27017/authtestapp`);
mongoose.connect(`mongodb://localhost:27017/authtestapp`);

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: String,
})

module.exports = mongoose.model("user", userSchema);  