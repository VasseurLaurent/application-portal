var fs = require('fs');

module.exports = class Session {

    getSettings(req, res) {
        fs.readFile(__dirname + '/settings.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            var settings = JSON.parse(data);

            res.render('settings', {
                settings: settings.settings,
                user: req.session.user
            })
        })
    }

    postSettings(req, res) {
        fs.readFile(__dirname + '/settings.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            var settings = JSON.parse(data);

            settings.settings = {
                websiteTitle: req.body.websiteTitle,
                websiteSubTitle: req.body.websiteSubTitle
            };

            fs.writeFile('settings.json', JSON.stringify(settings), {encoding:'utf8',flag:'w'}, function() {
                if (err) {console.log(err); throw err;}
                res.redirect('/');
            })
        })
    }

}