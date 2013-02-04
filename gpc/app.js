
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , routes = require('./routes');


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

// app.get('/', routes.userLogin);
// app.get('/home', routes.searchProject);
// app.get('/login', routes.userLogin);
// app.post('/login', routes.userLoginSubmit);
// app.get('/logout', routes.userLogoutSubmit);

// app.get('/register', routes.userRegister);
// app.post('/register', routes.userRegisterSubmit);

// app.get('/director', routes.directorVisit);
// app.get('/director/login', routes.directorLogin);
// app.post('/director/login', routes.directorLoginSubmit);
// app.post('/director/exec', routes.directorExec);
// app.post('/director/status', routes.queryStatus);
// app.post('/director/vote', routes.collectMarker);
// app.get('/director/vote/:project', routes.selectProject);
// app.get('/director/vote', routes.voteForm);
// app.get('/director/logout', routes.closeProject);

app.get('/management/project', routes.projectManagement);
app.post('/management/project/add', routes.addProject);
app.post('/management/project/remove', routes.removeProject);
app.post('/management/project/all', routes.queryAllProjects);

app.get('/management/candidate', routes.candidateManagement);
// app.post('/management/candidate/all', routes.queryProjectCandidate);
// app.post('/management/candidate/add', routes.addCandidate);
// app.post('/management/candidate/remove', routes.removeCandidate);

app.get('/director/result?:project', routes.showResult);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
