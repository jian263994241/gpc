
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , user_login = require('./routes/login')
  , user_register = require('./routes/register')
  , director = require('./routes/director');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/home', user_login.check);

app.get('/login', user_login.init);
app.post('/login', user_login.login);
app.get('/logout', user_login.logout);

app.get('/register', user_register.init);
app.post('/register', user_register.register);

app.get('/users', user.list);

app.get('/project-login', director.init);
app.post('/project-login', director.login);
app.get('/director', director.expo);
app.post('/candidate', director.candidate);

app.get('/start', director.start);
app.get('/end', director.end);

app.get('/vote', director.vote);
app.post('/status', director.status);
app.post('/collect', director.collect);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
