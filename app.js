require('dotenv').config();

//requerimos los siguientes modulos.
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const hbs = require('hbs');
hbs.registerPartials(__dirname + "/views/partials");
const mongoose = require('mongoose');

//requerimos los modulos 'express-sesion' y 'connect-mongo
const session = require('express-session'); 
const MongoStore = require('connect-mongo')(session); 

//para conectarnos en nuestra base de datos 'meetup'
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

//nuestras rutas.
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const meetingRouter = require('./routes/meeting');
const profileRouter = require('./routes/profile');


//ejecutamos express.
const app = express();

//configuramos el formato de nuestras vistas, que sera con handleabrs. 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//configuracion de middlewares.
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//configuramos la sesion y la agregamos como middleware a nuestra aplicación.
app.use(session({
  secret: 'learn and practice a new language',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}))

//este middleware verifica si hay una sesión. Si hay, setea algunos locals en la respuesta para que la vista acceda
app.use((req, res, next) => {
  if (req.session.currentUser) {
    //local, la información del usuario de la sesion.
    res.locals.currentUserInfo = req.session.currentUser;
    //local, es un boleano, indica si hay un usuario conectado. 
    res.locals.isUserLoggedIn = true;
  } else {
    res.locals.isUserLoggedIn = false;
  }

  next();
});

//ruta del favicon.
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/meet', meetingRouter);
app.use('/profile/', profileRouter);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
