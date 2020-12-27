const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const router = require('./routes');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);

require('dotenv').config({ path: 'variables.env' });

const app = express();

//Habilitar hbs como view
app.engine('handlebars',
    exphbs({
        defaultLayout: 'layout'
    })
);
app.set('view engine', 'handlebars');


//Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({ mongooseConnection: mongoose.connection })
}));

app.use('/', router());

app.listen(process.env.PUERTO);