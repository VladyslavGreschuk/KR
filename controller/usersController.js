const response = require('../response');
const db = require('../settings/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const cookieParser = require('cookie-parser');

exports.signup = (req, res) => {

    db.query("SELECT `email`, `nickname` FROM `users` WHERE `email` = '" + req.body.email + "' OR `nickname` = '" + req.body.nickname + "'", (error, rows, fields) => {
        if(error) {
            response.status(400, error, res);
        } else if(typeof rows != 'undefined' && rows.length > 0) {
            console.log(rows);
            response.status(400, `Row already exists`, res);
        } else {
            
            const salt = bcrypt.genSaltSync(15);
            const pass = bcrypt.hashSync(req.body.password, salt)
            db.query(
                'INSERT INTO users (nickname, name, surname, email, number,  password) VALUES (?, ?, ?, ?, ?, ?)',
                [req.body.nickname, req.body.name, req.body.surname, req.body.email, req.body.number, pass],
                (err, results) => {
                    if (err) {
                        console.error('Помилка під час збереження даних користувача:', err);
                        response.status(400, `Registration Error!`, res);
                        return;
                    }
                    console.log('Дані користувача збережено у базі даних');
                   res.redirect("/login");
                }
            );
        }
    }
    );
}

exports.login = (req, res) => {
    db.query("SELECT `id`, `email`, `password`, `nickname` FROM `users` WHERE `email` = '" + req.body.email + "' AND `nickname` = '" + req.body.nickname + "'", (error, rows, fields) => {
        if(error) {
            response.status(400, error, res);
        } else if(rows.length <= 0) {
            response.status(400, `User with email '${req.body.email}' and nickname '${req.body.nickname}' hasn't been found`, res);
        } else {
            const row = JSON.parse(JSON.stringify(rows));
            row.map(rw => {
                const password = bcrypt.compareSync(req.body.password, rw.password)
                if(password) {
                    const token = jwt.sign(
                    {
                        userId: rw.id,
                        email: rw.email
                    }, config.jwt, { expiresIn: 120 * 120 });
                    res.cookie('Authorization', `Bearer ${token}`);
                    res.redirect('/phonebook');
                } else {
                    response.status(401, `Incorrect password!`, res);
                }
                return true;
            })
        }
    }
    )
}

exports.settoken = (req, res) => {
    console.log(req.cookies)
    if (req.cookies && req.cookies.Authorization) {
        // Отримання токену з cookies
        const token = req.cookies.Authorization;

        // Верифікація токену
        jwt.verify(token.replace('Bearer ', ''), config.jwt, (err, decoded) => {
            if (err) {
                res.status(401).send('Unauthorized');
                return;
            }

            // decoded містить розшифровану інформацію з токену
            console.log(decoded);
            res.setHeader('Authorization', `${token}`);
            res.redirect("/phonebook");
        });
    } else {
        // Якщо cookies або Authorization властивість відсутні, поверніть 401 Unauthorized
        res.status(401).send('Unauthorized');
    }
};

exports.showUsers = (req, res) => {
    db.query('SELECT * FROM users', (error, rows, fields) => {
        if(error) {
            console.log(error);
        } else {
            response.status(200, rows, res);
        }
    })
}