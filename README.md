# Application portal

### Installation

##### Install node.js using [n](https://github.com/tj/n) (Node version management)

```
$ apt install curl
$ curl -o /usr/local/bin/n https://raw.githubusercontent.com/visionmedia/n/master/bin/n
$ chmod +x /usr/local/bin/n
$ n stable
```

##### Install [pm2](http://pm2.keymetrics.io/) (process manager)

```
$ npm install pm2 -g
```

##### Launch app using pm2

```
$ pm2 start index.js --name application-portal
```

###### Some useful pm2 commands

```
$ pm2 stop application-portal
$ pm2 restart application-portal
$ pm2 status
$ pm2 logs application-portal
```

Now the app runs on port 3000.