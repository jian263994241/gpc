/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path');
  // , routes = require('./routes');

var userOperator = require('./operation/user-operation');
var manageOperator = require('./operation/manage-operation');

var app = module.exports = express();

/**
 * Define map function to process api
 *
 * @see https://github.com/visionmedia/express/blob/master/examples/route-map/index.js
 */
app.map = function(a, route){
  route = route || '';
  for (var key in a) {
    switch (typeof a[key]) {
      case 'object':
        app.map(a[key], route + key);
        break;
      case 'function':
        app[key](route, a[key]);
        break;
    }
  }
};

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



// app.map({
//   '/':{
//     get:          userOperator.renderLoginView ,
//     'home':{
//       get:        userOperator.renderHomeView
//     },
//     'login':{
//       get:        userOperator.renderLoginView,
//       post:       userOperator.login
//     },
//     'logout':{
//       get:        userOperator.logout
//     },
//     'register':{
//       get:        userOperator.renderRegisterView,
//       post:       userOperator.register
//     },
//     'management':{
//       get:        routes.renderLoginManagementView,
//       '/login':   { post: routes.loginManagement },
//       '/logout':  { get: routes.logoutManagement },
//       '/project': {
//         get:      routes.projectManagement,
//         '/add':   { post: routes.addProject },
//         '/remove':{ post: routes.removeProject },
//         '/all':   { post: routes.queryAllProjects },
//         '/candidates': {
//           '/:projectId':  { get: routes.projectCandidatesManagement },
//           '/all':         { post: routes.queryProjectCandidates },
//           '/remove':      { post: routes.removeCandidateFromProject },
//           '/add':         { post: routes.insertCandidateIntoProject }
//         }
//       },
//       '/candidate':{
//         get:      routes.candidateManagement,
//         '/add':   { post: routes.addCandidate },
//         '/remove':{ post: routes.removeCandidate },
//         '/all':   { post: routes.queryAllCandidates }
//       },
//       '/user':{
//         get:      routes.renderUserManagerView,
//         '/all':   { post: routes.queryAllUsers },
//         '/remove': { post: routes.removeUser}
//       }
//     },
//   },
// });


// app.get('/director/result?:project', routes.showResult);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
