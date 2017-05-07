var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.set('view engine', 'pug')

app.get('/scrape', function (req, res) {

    url = 'http://www.imdb.com/title/tt1229340/';

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var title, release, rating;
            var json = { title: "", release: "", rating: "" };

            $('.header').filter(function () {
                var data = $(this);
                title = data.children().first().text();
                release = data.children().last().children().text();

                json.title = title;
                json.release = release;
            })

            $('.star-box-giga-star').filter(function () {
                var data = $(this);
                rating = data.text();

                json.rating = rating;
            })
        }

        //fs will take the 'json' object, stringify it, and send that to the './output.json' file.
        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            res.render('index', { title: 'Node WebScraper Fun', message: JSON.stringify(json) })
        })
    });
})



app.listen('8081')
console.log('Listening on 8081');
exports = module.exports = app;