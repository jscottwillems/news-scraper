const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    date: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    }
    
});

var Article = mongoose.model("Article", ArticleSchema)

module.exports = Article;

