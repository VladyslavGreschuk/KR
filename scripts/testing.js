const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/ogo.html")
});

app.get('/news/:id', function(req, res) {
    res.send('ID is - ' + req.params.id);
});

app.listen(3000, () => {
    console.log('port 3000!');
});