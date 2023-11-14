const response = require('../settings/response');
const db = require('../settings/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../settings/config');
const cookieParser = require('cookie-parser');

exports.addContact = (req, res) => {
    db.query(
        'INSERT INTO contacts (name, surname, email, number, user_id, date) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
        [req.body.name, req.body.surname, req.body.email, req.body.number, req.body.user_id],
        (err, result) => {
            if (err) {
                console.error('Помилка під час додавання користувача:', err);
                response.status(400, `Query error!`, res);
                return;
            }
            const ID = result.insertId;
            db.query('SELECT * FROM contacts WHERE id = ?', [ID], (err, rows, fields) => {
                if (err) {
                    console.error('Помилка під час вибору контакту:', err);
                    response.status(400, 'error', res);
                }
            console.log('Контакт збережено у базі даних');
            response.status(200, rows, res);
            }
    )
})
}

exports.showContacts = (req, res) => {
    db.query("SELECT * FROM contacts WHERE `user_id` = '" + req.body.user_id + "'", (error, rows) => {
        if(error) {
            response.status(400, error, res);
        } else {
            response.status(200, rows, res);
        }
    })
}

exports.deleteContact = (req, res) => {
    db.query(
        "DELETE FROM contacts WHERE `user_id` = ? AND `id` = ?",
        [req.params.user_id, req.params.id],
        (error, result) => {
            if (error) {
                response.status(400, error, res);
            } else if (result.affectedRows === 0) {
                response.status(400, `Incorrect id: ${req.body.id}`, res);
            } else {
                // Контакт успішно видалено
                response.status(200, `success`, res);
            }
        }
    );
    
}