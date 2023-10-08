const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');

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

app.post('/reg', function(req, res){
    console.log('success');
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const cyrillicPattern = /[а-яА-ЯёЁ]/;

    res.send('Ви успішно зареєструвались!');
    connection.query(
         'INSERT INTO test (name, email, password) VALUES (?, ?, ?)',
         [name, email, password],
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

app.listen(8080, () => {
    console.log('Сервер запущено на порту 8080');
});