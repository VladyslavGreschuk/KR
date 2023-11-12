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

exports.setTokenHeader = (req, res, next) => {
    if (req.cookies.Authorization) {
        const token = req.cookies.Authorization;
        res.setHeader('Authorization', `Bearer ${token}`);
    } else {
        response.status(401, `Cannot get token!`, res);
    }
    next();
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
                    res.cookie('Authorization', `${token}`);

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

exports.showUsers = (req, res) => {
    db.query('SELECT * FROM users', (error, rows, fields) => {
        if(error) {
            console.log(error);
        } else {
            response.status(200, rows, res);
        }
    })
}