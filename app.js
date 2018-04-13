const http = require("http");
const express = require('express');
const app = express();

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res, next) {
  res.render('index');
})

app.listen(3000);

