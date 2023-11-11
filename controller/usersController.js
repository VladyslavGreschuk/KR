const response = require('../response');
const db = require('../settings/db');

exports.signup = (req, res) => {

    db.query("SELECT `email`, `nickname` FROM `users` WHERE `email` = '" + req.body.email + "' OR `nickname` = '" + req.body.nickname + "'", (error, rows, fields) => {
        if(error) {
            response.status(400, error, res);
        } else if(typeof rows != 'undefined' && rows.length > 0) {
            console.log(rows);
            response.status(400, `Row already exists`, res);
        } else {
            db.query(
                'INSERT INTO users (nickname, name, surname, email, number,  password) VALUES (?, ?, ?, ?, ?, ?)',
                [req.body.nickname, req.body.name, req.body.surname, req.body.email, req.body.number, req.body.password],
                (err, results) => {
                    if (err) {
                        console.error('Помилка під час збереження даних користувача:', err);
                        response.status(400, `Registration Error!`, res);
                        return;
                    }
                    console.log('Дані користувача збережено у базі даних');
                   res.redirect("/phonebook");
                }
            );
        }
    }
    );
}

exports.login = (req, res) => {
    db.query("SELECT `email`, `nickname`, `password` FROM `users` WHERE `email` = '" + req.body.email + "' AND `nickname` = '" + req.body.nickname + "' AND `password` = '" + req.body.password + "'", (error, rows, fields) => {
        if(error) {
            response.status(400, error, res);
        } else if(typeof rows != 'undefined' && rows.length > 0) {
            console.log(rows);
            res.redirect("/phonebook");
            console.log("Користувач успішно авторизувався!");
            return;
        } else {
            response.status(400, `Incorrect nickname or email`, res);
            return;
        }
    }
    )
}

exports.showUsers = (req, res) => {
    db.query('SELECT * FROM users', (error, rows, fields) => {
        if(error) {
            console.log(error);
        } else {
            response.status(200, rows, res);
        }
    })
}