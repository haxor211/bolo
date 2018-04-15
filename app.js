const http = require("http");
const express = require('express');
const app = express();
const myParser = require('body-parser');
const qs = require('querystring');
const db = require('./database')

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.static(__dirname + '/public'))
app.use(myParser.urlencoded({ extended: false }));
app.use(myParser.json())

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.use(allowCrossDomain);

app.get('/', function (req, res, next) {
  res.render('index');
})

app.get('/tl', function (req, res, next) {
  db.all('select * from movies', function (err, rows) {
    if (err)
      return next(err);
    var data = {};
    rows.forEach(function (row) {
      data[row.id] = {
        title: row.title,
        seed: row.seed,
        url: row.url
      }
      console.log(row.id + row.title + row.seed + row.url)
    });

    res.render('tl', { data: JSON.stringify(data), myob: data });
  })
})

app.post("/", function (req, res) {
  var jsonString = JSON.stringify(req.body || {});
  db.serialize(function () {
    var stmt = db.prepare("INSERT INTO movies (id, title, seed, url) VALUES (?,?,?,?)");
    for (var i = 0; i < req.body.length; i++) {
      var d = new Date();
      var data = req.body;
      var n = d.toLocaleTimeString();
      stmt.run(i, req.body[i].title, req.body[i].seed, req.body[i].url);
    }
    stmt.finalize();
  });
  res.send('You sent: this to Express');
});

app.listen(8080);

