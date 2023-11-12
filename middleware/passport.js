const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../settings/db');
const config = require('../config');
const cookieParser = require('cookie-parser');
const response = require('../response');

const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req, res) => {
            if (req.cookies.Authorization) {
                return req.cookies.Authorization;
            } else {
                response.status(401, `Cannot get token!`, res);
            }
        }
    ]),
    secretOrKey: config.jwt
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, (payload, done) => {
            try {
                db.query("SELECT `nickname`, `name`, `surname`, `email`, `number` FROM `users` WHERE `id` = '" + payload.userId + "'", (error, rows, fields) => {
                    if (error) {
                        console.log(error);
                        done(error, null);
                    } else {
                        const user = rows[0]; // Отримуємо перший рядок результату (якщо є)
                        if (user) {
                            done(null, user);
                        } else {
                            done(null, false);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
                done(e, null);
            }
        })
    );
};