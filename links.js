var fs = require('fs');

module.exports = class Links {

    listLinks(req, res) {
        fs.readFile(__dirname + '/settings.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            var settings = JSON.parse(data);
            if (typeof settings.links == 'undefined') settings.links = [];

            res.render('links', {
                settings: settings.settings,
                links: settings.links,
                user: req.session.user
            })
        })
    }

    addLink(req, res) {
        fs.readFile(__dirname + '/settings.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            var settings = JSON.parse(data);
            if (typeof settings.links == 'undefined') settings.links = [];

            var newLink = {
                url: req.body.url,
                logo: req.body.logo,
                name: req.body.name,
                security: req.body.security
            }

            settings.links.push(newLink);

            fs.writeFile('settings.json', JSON.stringify(settings), {encoding:'utf8',flag:'w'}, function() {
                if (err) {console.log(err);}
                res.redirect('/manage-links');
            })  
        })
    }

    removeLink(req, res) {
        fs.readFile(__dirname + '/settings.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            var settings = JSON.parse(data);
            if (typeof settings.links == 'undefined') settings.links = [];

            var queryLink = {
                url: decodeURIComponent(req.query.url),
                logo: decodeURIComponent(req.query.logo),
                name: decodeURIComponent(req.query.name),
                security: decodeURIComponent(req.query.security)
            }

            var toRemove = settings.links.find(function(element) {
                return JSON.stringify(element) == JSON.stringify(queryLink);
            })

            if (toRemove) {
                settings.links.splice(settings.links.indexOf(toRemove), 1);
            }

            fs.writeFile('settings.json', JSON.stringify(settings), {encoding:'utf8',flag:'w'}, function() {
                if (err) {console.log(err)}
                res.redirect('/manage-links');
            })
        })
    }

}