var express = require("express");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 8080;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

var exphbs = require ("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.listen(PORT, function() {
    console.log("App listening pn PORT: " + PORT);
});