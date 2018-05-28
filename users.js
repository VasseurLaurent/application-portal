var fs = require('fs');
var md5 = require('md5');

module.exports = class Users {

    getCreateAdmin(req, res) {
        fs.readFile(__dirname + '/users.json', "utf8", function(err, data) {
            if (!err) { return res.redirect('/'); }
    
            res.render('create-admin');
        })
    }

    postCreateAdmin(req, res) {
        fs.readFile(__dirname + '/users.json', "utf8", function(err, data) {
            if (!err) return res.redirect('/');
        })
    
        var content = {
            admin: {
                email: req.body.email,
                password: md5(req.body.password)
            }
        }
    
        fs.writeFile('users.json', JSON.stringify(content), function(err) {
            if (err) {console.log(err); throw err;}
            return res.redirect('/');
        })
    }

    listUsers(req, res) {
        fs.readFile(__dirname + '/users.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            var users = JSON.parse(data);
            var guests = [];
            if (users.guests)
                var guests = users.guests;
            
            res.render('users', {
                guests: guests,
                user: req.session.user
            })

        })
    }

    addGuest(req, res) {
        fs.readFile(__dirname + '/users.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            var users = JSON.parse(data);
            if (!users.guests)
                users.guests = [];

            users.guests.push({
                email: req.body.email,
                password: md5(req.body.password)
            });

            fs.writeFile('users.json', JSON.stringify(users), {encoding:'utf8',flag:'w'}, function() {
                if (err) {console.log(err); throw err;}
                res.redirect('/manage-users');
            })
        })
    }

    removeGuest(req, res) {
        fs.readFile(__dirname + '/users.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            var users = JSON.parse(data);
            if (!users.guests)
                users.guests = [];

            var toRemove = users.guests.find(function(element) {
                return element.email == decodeURIComponent(req.query.email);
            })

            if (toRemove) {
                users.guests.splice(users.guests.indexOf(toRemove), 1);
            }

            fs.writeFile('users.json', JSON.stringify(users), {encoding:'utf8',flag:'w'}, function() {
                if (err) {console.log(err); throw err;}
                res.redirect('/manage-users');
            })
        })
    }

}