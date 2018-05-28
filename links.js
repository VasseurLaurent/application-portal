var fs = require('fs');

module.exports = class Links {

    listLinks(req, res) {
        fs.readFile(__dirname + '/users.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            fs.readFile(__dirname + '/links.json', "utf8", function(err, data) {
                var links = {};
                if (!err) links = JSON.parse(data);
                
                res.render('links', {
                    links: links,
                    user: req.session.user
                })    
            })
        })
    }

    addLink(req, res) {
        fs.readFile(__dirname + '/users.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            fs.readFile(__dirname + '/links.json', "utf8", function(err, data) {
                var links = [];
                if (!err) links = JSON.parse(data);
                else fs.open('links.json', 'w', function() {});

                var newLink = {
                    url: req.body.url,
                    logo: req.body.logo,
                    name: req.body.name,
                    security: req.body.security
                }

                links.push(newLink);
                
                fs.writeFile('links.json', JSON.stringify(links), {encoding:'utf8',flag:'w'}, function() {
                    if (err) {console.log(err);}
                    res.redirect('/manage-links');
                })  
            })
        })
    }

    removeLink(req, res) {
        fs.readFile(__dirname + '/users.json', "utf8", function(err, data) {
            if (err || typeof req.session.user == 'undefined' || req.session.user.type != 'Admin') return res.redirect('/');

            fs.readFile(__dirname + '/links.json', "utf8", function(err, data) {
                var links = {};
                if (!err) links = JSON.parse(data);

                var queryLink = {
                    url: decodeURIComponent(req.query.url),
                    logo: decodeURIComponent(req.query.logo),
                    name: decodeURIComponent(req.query.name),
                    security: decodeURIComponent(req.query.security)
                }

                var toRemove = links.find(function(element) {
                    return JSON.stringify(element) == JSON.stringify(queryLink);
                })

                if (toRemove) {
                    links.splice(links.indexOf(toRemove), 1);
                }
                
                fs.writeFile('links.json', JSON.stringify(links), {encoding:'utf8',flag:'w'}, function() {
                    if (err) {console.log(err)}
                    res.redirect('/manage-links');
                })  
            })
        })
    }

}