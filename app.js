const http = require("http");
const express = require('express');
const app = express();
const myParser = require('body-parser');
const qs = require('querystring');


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
  res.render('tl');
})

app.post("/", function (req, res) {
  response = {
    first_name: req.body
  };

  console.log('SHOW ME BODY')
  console.log(req.body);
  
  res.send('You sent: this to Express');
});

app.listen(8080);

