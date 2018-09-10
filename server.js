const express = require('express');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const request = require('request');
const db = require('./models');
const PORT = process.env.PORT || 3000;
const app = express();

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine" , "handlebars");

app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/news_scraper_db';
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get('/', function(req, res) {
    request('https://www.nytimes.com/section/world', function(err, res, html) {
        const $ = cheerio.load(html);
        $('article').each(function(i, element) {
            newTitle = $(element).find('.headline').text().trim();
            newSummary = $(element).find('.summary').text().trim();
            newImg = $(element).find('img').attr('src');
            newLink = $(element).find('.story-link').attr('href');
            newDate = $(element).find('.dateline').text().trim();
    
            if(newTitle != '' && newSummary != '' && newLink != undefined && newImg != undefined) {
                
                db.Article.create({
                    title: newTitle,
                    summary: newSummary,
                    link:  newLink,
                    img: newImg,
                    date: newDate,
                    timestamp: newDate
                },
                function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log(data);
                    };
                });
            };
        });       
    });
    res.render("index");
});

app.get("/articles", function(req, res) {
    db.Article.find({}).sort({timestamp: -1}).then(function(dbArticle) {
        console.log(dbArticle)
        res.render("index", {
           article: dbArticle
        });
    }).catch(function(err) {
        res.json(err);
    });
});

app.get("/saved", function(req, res) {
    db.Article.find({ saved: true }).then(function(dbArticle) {
        res.render("index", {
            article: dbArticle
        });
    }).catch(function(err) {
        res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id})
    .populate("comment")
    .then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
    db.Com.create(req.body).then(function(dbNote) {
        return db.Article.findOneAndUpdate({_id: req.params.id}, {saved: true});
    }).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.listen(PORT, function() {
    console.log(`App listening on port: ${PORT}!`);
});