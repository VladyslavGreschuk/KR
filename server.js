const express = require('express');
const response = require('./settings/response');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const usersController = require('./controller/usersController');
const contactsController = require('./controller/contactsController');
const passport = require('passport');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
require('./middleware/passport')(passport);


app.set('view engine', 'ejs');

// add
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
//


// unsecured
app.get('/reg', function (req, res) {
    res.render('reg');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.route('/reg').post(usersController.signup);

app.route('/login').post(usersController.login);

app.route('/phonebook/adding').post(contactsController.addContact);

app.get('/logout', function (req, res) {
    res.clearCookie('Authorization');
    res.redirect('/login');
});

app.get('/about', function (req, res) {
    res.render('about');
});
//


// secured
app.route('/phonebook').get(usersController.setTokenHeader, passport.authenticate('jwt', {session: false}), function (req, res) {

    res.render('phonebook', {name: req.user.name, surname: req.user.surname});
});

app.route('/phonebook/profile').get(usersController.setTokenHeader, passport.authenticate('jwt', {session: false}), function (req, res) {

    res.render('profile', {name: req.user.name, surname: req.user.surname, username: req.user.nickname, email: req.user.email, number: req.user.number, id: req.user.id, role: req.user.role});
});

app.route('/phonebook/list').get(usersController.setTokenHeader, passport.authenticate('jwt', {session: false}), function (req, res) {
    res.render('list', {contacts: req.user.contacts, contactCount: req.user.contactCount, id: req.user.id});
});

app.route('/phonebook/adding').get(usersController.setTokenHeader, passport.authenticate('jwt', {session: false}), function (req, res) {
    res.render('adding', {id: req.user.id});
});

app.route('/userslist').get(passport.authenticate('jwt', {session: false}), usersController.showUsers);

app.route('/contactslist').get(passport.authenticate('jwt', {session: false}), contactsController.showContacts);

app.route('/deletecontact/:id/:user_id').delete(passport.authenticate('jwt', {session: false}), contactsController.deleteContact);
//

app.listen(3000, () => {
    console.log('Сервер запущено на порту 3000');
});