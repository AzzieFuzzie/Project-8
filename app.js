var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Test connection to database and sync model

const sequelize = require('./models').sequelize;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();
// import routes
const routes = require('./routes');

app.use(routes);
// 404 Error Handler

app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  res.render('page_not_found');
  next(err);
});

app.use((req, res, next) => {
  const err = new Error('Oops');
  err.status = 500;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('error');
});
module.exports = app;
