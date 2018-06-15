const express = require('express');
const app = express();
const myParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('basen-pro.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to basen-pro database.');
});

app.get('/', (req, res) => {
    db.all('SELECT * FROM basen', (err, dane) => {
        var daneTab = [];
        if (err) {
            return console.error(err.message);
        }
        console.log(dane);
        dane.forEach(function (row) {
            daneTab.push(row);
        })
        res.render('basen/index', { dane: daneTab });
    });
})

app.get('/create-db', (req, res) => {

})

app.get('/add', (req, res) => {
    res.redirect('/basen');
})

app.post('/add', (req, res) => {
    console.log(req.body);
    db.serialize(function () {
        var stmt = db.prepare("INSERT INTO basen (data, typ, operator, name, liczbaos, enter, exit, formapl, gotowka) VALUES (?,?,?,?,?,?,?,?,?)");
        var incoming = req.body;
        var d = new Date();
        var n = d.toLocaleTimeString();
        var data = d.toISOString().split('T')[0];
        stmt.run(data, incoming.typ, incoming.operator, incoming.name, incoming.ilosc, n, null, null, null);
        stmt.finalize();
        res.redirect('/basen');
    });
});

app.get('/del/:id', (req, res) => {
    db.serialize(function () {
        let id = req.params.id;
        db.run("DELETE FROM Reda WHERE id = ?", id);
        res.redirect('/basen');
    });
});

module.exports = app;