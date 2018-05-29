var fs = require('fs');
var md5 = require('md5');

module.exports = class Users {

    getCreateAdmin(req, res) {
        fs.readFile(__dirname + '/settings.json', "utf8", function(err, data) {
            if (!err) { return res.redirect('/'); }
    
            var content = {
                settings: {
                    websiteTitle: "Application portal",
                    websiteSubTitle: "Welcome to my portal"
                }
            }

            fs.writeFile('settings.json', JSON.stringify(content), function(err) {
                if (err) {console.log(err);}
                res.render('create-admin', {
                    settings: content.settings
                });
            })
            
        })
    }

    postCreateAdmin(req, res) {
        fs.readFile(__dirname + '/settings.json', "utf8", function(err, data) {
            if (data.users) return res.redirect('/');

            var settings = JSON.parse(data);
            settings.users = {
                admin: {
                    email: req.body.email,
                    password: md5(req.body.password)
                }
            }
        
            fs.writeFile('settings.json', JSON.stringify(settings), function(err) {
                if (err) {console.log(err);}
                req.session.user = {type: 'Admin'};
                return res.redirect('/settings');
            })
        })
    }

    listUsers(req, res) {
        fs.readFile(__dirname + '/settings.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            var settings = JSON.parse(data);
            var guests = [];
            if (settings.users.guests)
                guests = settings.users.guests;
            
            res.render('users', {
                settings: settings.settings,
                guests: guests,
                user: req.session.user
            })

        })
    }

    addGuest(req, res) {
        fs.readFile(__dirname + '/settings.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            var settings = JSON.parse(data);
            if (!settings.users.guests)
                settings.users.guests = [];

            settings.users.guests.push({
                email: req.body.email,
                password: md5(req.body.password)
            });

            fs.writeFile('settings.json', JSON.stringify(settings), {encoding:'utf8',flag:'w'}, function() {
                if (err) {console.log(err); throw err;}
                res.redirect('/manage-users');
            })
        })
    }

    removeGuest(req, res) {
        fs.readFile(__dirname + '/settings.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            var settings = JSON.parse(data);
            if (!settings.users.guests)
                settings.users.guests = [];

            var toRemove = settings.users.guests.find(function(element) {
                return element.email == decodeURIComponent(req.query.email);
            })

            if (toRemove) {
                settings.users.guests.splice(settings.users.guests.indexOf(toRemove), 1);
            }

            fs.writeFile('settings.json', JSON.stringify(settings), {encoding:'utf8',flag:'w'}, function() {
                if (err) {console.log(err); throw err;}
                res.redirect('/manage-users');
            })
        })
    }

}