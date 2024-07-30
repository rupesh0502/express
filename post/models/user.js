const mongoose = require('mongoose');

// mongoose.connect(`localhost/mongopractice`)
mongoose.connect(`mongodb://127.0.0.1:27017/post-data`);

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    profilepic: { type: String, default: "image.png" },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post'}]
});

module.exports = mongoose.model("user", userSchema);