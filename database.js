const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('movies');

db.serialize(function(filmy) {
  var stmt = db.prepare("INSERT INTO movies VALUES (?,?,?,?)");
  for (var i = 0; i < 10; i++) {
  
  var d = new Date();
  var data = filmy;
  }
});

module.exports = db;