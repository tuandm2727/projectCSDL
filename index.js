const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
var flash = require('express-flash');
var session = require('express-session');

const homeRoutes = require('./routes/home-routes');
const studentRoutes = require('./routes/student-routes');
const employeeRoutes = require('./routes/employee-routes');
const programRoutes = require('./routes/program-routes');
const roomRoutes = require('./routes/room-routes');
const subjectRoutes = require('./routes/subject-routes');
const lecturerRoutes = require('./routes/lecturer-routes');

const app = express();

app.use(expressLayouts);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))

app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(homeRoutes.routes);
app.use(studentRoutes.routes);
app.use(employeeRoutes.routes);
app.use(programRoutes.routes);
app.use(programRoutes.routes);
app.use(roomRoutes.routes);
app.use(subjectRoutes.routes);
app.use(lecturerRoutes.routes);

app.listen(8080, () => console.log('app url http://localhost:8080'));

