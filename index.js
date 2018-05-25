var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

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

app.get('/', function(req, res) {
    fs.readFile(__dirname + '/links.json', "utf8", function(err, data) {
        
        var links = [];
        if (!err) {
            var links = JSON.parse(data);            
        }

        res.render('home', {
            err: err,
            links: links
        })
        
    })
})

app.listen(3000);