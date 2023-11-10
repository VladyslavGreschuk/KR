const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const ejs = require('ejs');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'test'
});

connection.connect(function(err) {
    if (err) {
        console.error('Помилка підключення до MySQL:', err);
        throw err;
    }
    console.log('Підключено до MySQL');
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/reg', function (req, res) {
    res.render('reg');
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

app.post('/phonebook', function(req, res){
    console.log('success');
    const nickname = req.body.nickname;
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const number = req.body.number;
    const password = req.body.password;

    console.log(name);
    connection.query(
         'INSERT INTO users (nickname, name, surname, email, number,  password) VALUES (?, ?, ?, ?, ?, ?)',
         [nickname, name, surname, email, number, password],
         (err, results) => {
             if (err) {
                 console.error('Помилка під час збереження даних користувача:', err);
                 res.status(500).send('Помилка під час реєстрації');
                 return;
             }
             console.log('Дані користувача збережено у базі даних');

         }
     );
});

app.listen(3000, () => {
    console.log('Сервер запущено на порту 3000');
});