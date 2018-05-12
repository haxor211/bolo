const http = require("http");
const express = require('express');
const app = express();
const myParser = require('body-parser');


app.get('/', function(req, res) {
    res.render('basen/index');
})

app.get('/create-db', function(req, res) {
    
})

module.exports = app;