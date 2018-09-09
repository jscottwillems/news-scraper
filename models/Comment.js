var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    title: String,
    body: String
});

var Com = mongoose.model("Comment", CommentSchema);

module.exports = Com;