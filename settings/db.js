const mysql = require('mysql2');
const config = require('../config');

const connection = mysql.createConnection({
    host: config.HOST,
    user: config.DBUSER,
    database: config.DBNAME
});

connection.connect(function(err) {
    if (err) {
        console.error('Помилка підключення до MySQL:', err);
        throw err;
    }
    console.log('Підключено до MySQL');
});

module.exports = connection;