const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');

app.get('/reg', function(req, res) {
    res.render('reg');
});

app.get('/style/style.css', function(req, res) {
    res.sendFile(__dirname + '/public/style/style.css');
});

app.get('/scripts/valid.js', function(req, res) {
    res.sendFile(__dirname + '/scripts/valid.js')
})

app.listen(3000, () => {
    console.log('port 3000!');
});