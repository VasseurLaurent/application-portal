var fs = require('fs');
var md5 = require('md5');

module.exports = class Session {

    getLogin(req, res) {
        fs.readFile(__dirname + '/users.json', "utf8", function(err, data) {
            if (err) return res.redirect('/');

            if (req.session.user) return res.redirect('/');

            res.render('login')
        })
    }

    postLogin(req, res) {
        fs.readFile(__dirname + '/users.json', "utf8", function(err, data) {
            if (err) return res.redirect('/');

            if (req.session.user) return res.redirect('/');

            fs.readFile(__dirname + '/users.json', "utf8", function(err, data) {

                var users = JSON.parse(data);
    
                if (req.body.email == users.admin.email && md5(req.body.password) == users.admin.password) {
                    req.session.user = {type: "Admin"};
                    return res.redirect('/');
                }
                else if (users.guests) {
                    var check = 0;

                    var interval = setInterval(function() {
                        if (check == users.guests.length) {
                            return res.render('login', {
                                message: "Email & password don't match. Could not log in."
                            });
                        }
                    }, 50);

                    users.guests.forEach(function(guest) {
                        if (req.body.email == guest.email && md5(req.body.password) == guest.password) {
                            req.session.user = {type: "Guest"};
                            return res.redirect('/');
                        }
                        check++;
                    })

                }
                else {
                    return res.render('login', {
                        message: "Email & password don't match. Could not log in."
                    });
                }
            })
        })
    }

    logout(req, res) {
        if (req.session.user)
            req.session.user = null;
        res.redirect('/');
    }

}