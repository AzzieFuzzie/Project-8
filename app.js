var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/books');
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
const routes = require('./routes/books');

app.use(routes);
// 404 Error Handler

app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  res.render('page-not-found');
  next(err);
});

// app.use((req, res, next) => {
//   const err = new Error('Oops');
//   err.status = 500;
//   next(err);
// });

// Global error handler
app.use((err, req, res, next) => {
  if (err) {
    console.log('Global error handler called', err);
  }

  if (err.status === 404) {
    res.status(404).render('page-not-found', { err });
  } else {
    err.message = err.message || 'Oops';
    res.status(err.status || 500).render('errors', { err });
  }
});
module.exports = app;
