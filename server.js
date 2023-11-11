const express = require('express');
const response = require('./response');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const usersController = require('./controller/usersController');


app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/reg', function (req, res) {
    res.render('reg');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/phonebook', function (req, res) {
    res.render('phonebook');
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/list', function (req, res) {
    res.render('list');
});

app.get('/style/style.css', function (req, res) {
    res.sendFile(__dirname + '/public/style/style.css');
});

app.get('/style/forinput.css', function (req,res) {
    res.sendFile(__dirname + '/public/style/forinput.css');
});

app.get('/scripts/valid.js', function (req, res) {
    res.sendFile(__dirname + '/scripts/valid.js')
});

app.get('/scripts/scroll.js', function (req,res) {
    res.sendFile(__dirname + '/scripts/scroll.js');
});

app.route('/reg').post(usersController.signup);

app.route('/userslist').get(usersController.showUsers);

app.route('/log').post(usersController.login);

app.listen(3000, () => {
    console.log('Сервер запущено на порту 3000');
});