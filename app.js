const http = require("http");
const express = require('express');
const app = express();
const myParser = require('body-parser');
const qs = require('querystring');

/*
const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('movies');

db.serialize(function() {
  db.run("CREATE TABLE movies (title TEXT, seed INT, url TEXT)");

  var stmt = db.prepare("INSERT INTO movies VALUES (?,?)");
  for (var i = 0; i < 10; i++) {
  
  var d = new Date();
  var n = d.toLocaleTimeString();
  stmt.run(i, n);
  }
  stmt.finalize();

  db.each("SELECT title, seed, url FROM movies", function(err, row) {
      console.log("Movie title : "+row.title, row.seed, row.url);
  });
});

db.close();
*/
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
  var jsonString = req.body;
  res.render('index', {test: jsonString});
})

app.get('/tl', function (req, res, next) {
  res.render('tl');
})

app.post("/", function (req, res) {
  var jsonString = JSON.stringify(req.body || {}); 
  console.log(req.body);

  //res.send('You sent: this to Express');
});

app.listen(8080);

