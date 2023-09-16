const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const homeRoutes = require('./routes/home-routes');
const studentRoutes = require('./routes/student-routes');
var flash = require('express-flash');
var session = require('express-session');

const app = express();

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))

app.use(express.static(path.join(__dirname, 'public')));
app.use(homeRoutes.routes);
app.use(flash());
app.use(studentRoutes.routes);

app.listen(8080, () => console.log('app url http://localhost:8080'));

