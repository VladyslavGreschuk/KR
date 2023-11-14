const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../settings/db');
const config = require('../settings/config');
const cookieParser = require('cookie-parser');
const response = require('../settings/response');

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
                db.query("SELECT `id`, `nickname`, `name`, `surname`, `email`, `number`, `role` FROM `users` WHERE `id` = '" + payload.userId + "'", (error, rows, fields) => {
                    if (error) {
                        console.log(error);
                        done(error, null);
                    } else {
                        const user = rows[0];
                        if (user) {
                            db.query("SELECT *, DATE_FORMAT(`date`, '%Y-%m-%d') AS formattedDate FROM contacts WHERE `user_id` = '" + user.id + "'", (contactError, contactRows, contactFields) => {
                                if (contactError) {
                                    console.log(contactError);
                                    done(contactError, null);
                                } else {
                                    // Додаємо інформацію про контакти до об'єкту користувача
                                    user.contacts = contactRows;

                                    db.query("SELECT COUNT(*) AS contactCount FROM contacts WHERE `user_id` = '" + user.id + "'", (contactError, result) => {
                                        if (contactError) {
                                            console.log(contactError);
                                            done(contactError, null);
                                        } else {
                                            const contactCount = result[0].contactCount;
                                            user.contactCount = contactCount;
                                            done(null, user);
                                        }
                                    })
                                }

                            })}
                    }
                });
            } catch (e) {
                console.log(e);
                done(e, null);
            }
        })
    );
};