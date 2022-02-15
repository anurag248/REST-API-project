const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

.get( function (req, res) {
    Article.find(function (err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post( function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Success");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Deleted everything");
        } else {
            res.send(err);
        }
    });
});

app.route("/articles/:articleTitle")

.get(function(req,res){

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title");
        }
    })
})

.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title , content: req.body.content},
        function(err){
            if(!err){
                res.send("Successfully Updated");
            }
        }
    );
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Success");
            }
        }
    );
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully Deleted");
            }
        }
    );
});


app.listen(3000, function () {
    console.log("Server up and running");
});