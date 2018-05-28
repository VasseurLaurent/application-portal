var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var md5 = require('md5');
var Users = require('./users');
var AppSession = require('./session');
var Links = require('./links');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');
app.use('/scripts', express.static(__dirname + '/scripts/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/font-awesome', express.static(__dirname + '/node_modules/font-awesome/'));
app.use('/styles', express.static(__dirname + '/styles/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
  }));

var users = new Users();
var appSession = new AppSession();
var linksClass = new Links();

app.get('/', function(req, res) {
    fs.readFile(__dirname + '/users.json', "utf8", function(err, data) {
        if (err) return res.redirect('/create-admin');
    })

    fs.readFile(__dirname + '/links.json', "utf8", function(err, data) {
        
        var links = [];
        if (!err) {
            var links = JSON.parse(data);            
        }

        if (!req.session.user) {
            links = links.filter(link => link.security == 'public');
        }
        else if (req.session.user && req.session.user.type == 'Guest') {
            links = links.filter(link => link.security != 'admin');
        }

        res.render('home', {
            err: err,
            links: links,
            user: req.session.user
        })
        
    })
})

app.get('/create-admin', users.getCreateAdmin)

app.post('/create-admin', users.postCreateAdmin)

app.get('/login', appSession.getLogin)

app.post('/login', appSession.postLogin)

app.get('/logout', appSession.logout)

app.get('/manage-users', users.listUsers)

app.post('/add-guest', users.addGuest)

app.get('/remove-guest', users.removeGuest)

app.get('/manage-links', linksClass.listLinks)

app.post('/add-link', linksClass.addLink)

app.get('/remove-link', linksClass.removeLink)

app.listen(3000);