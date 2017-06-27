const favicon = require('serve-favicon');
const express = require('express');
const session = require('express-session');
const cookieSession = require('cookie-session');
const minify = require('express-minify');
const passport = require('passport');
const DiscordS = require('passport-discord').Strategy;
const bodyParser = require('body-parser');
const fs = require('fs');
var path = require('path');

const app = exports.app = express();
let connection;

const auth = exports.auth = require('./auth');
const web = exports.web = require('./web');

module.exports = function (config, client) {
    try {

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(express.static('Web'));
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
        app.use(minify());
        app.use(express.static(path.join(__dirname, 'static')))
        app.use(cookieSession({
            name: 'loginSession',
            keys: [config.clientID, config.session_secret],
            maxAge: 12 * 60 * 60 * 1000 // 48 hours
        }));

    } catch (err) {
        console.error(`An error occurred during Web initialisation, Error: ${err.stack}`);
    }

// Set up modules
    try {
        auth(config, app, passport, DiscordS);
        web(app, config, client);
    } catch (err) {
        console.error(`An error occurred during webserver module initialisation, Error: ${err.stack}`);
    }
}