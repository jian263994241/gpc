/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path');

var userOperator    = require('./operation/user-operation');
var manageOperator  = require('./operation/manage-operation');
var voteOperator    = require('./operation/vote-operation');

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

// app.get('/director/result?:project', routes.showResult);

app.map({
  '/':{
    get:          userOperator.renderLoginView ,
    'home':{
      get:        userOperator.renderHomeView
    },
    'login':{
      get:        userOperator.renderLoginView,
      post:       userOperator.login
    },
    'logout':{
      get:        userOperator.logout
    },
    'register':{
      get:        userOperator.renderRegisterView,
      post:       userOperator.register
    },
    'management':{
      get:        manageOperator.renderLoginView,
      '/login': {
        post:     manageOperator.login
      },
      '/logout': {
        get:      manageOperator.logout
      },
      '/:module': {
        get:      manageOperator.render,
        '/all': {
          post:   manageOperator.queryAll
        },
        '/add': {
          post:   manageOperator.add
        },
        '/remove': {
          post:   manageOperator.remove
        },
        '/candidates': {
          '/:projectId':{ 
            get:  manageOperator.renderProjectDetailView 
          },
          '/all':{ 
            post: manageOperator.queryProjectCandidates 
          },
          '/remove':{ 
            post: manageOperator.removeCandidateFromProject 
          },
          '/add':{ 
            post: manageOperator.insertCandidateIntoProject 
          }
        }
      }
    },
    'director':{
      get:        voteOperator.renderDirectorView,
      '/login':{
        get:      voteOperator.renderDirectorLoginView,
        post:     voteOperator.login
      },
      '/logout':{
        get:      voteOperator.close
      },
      '/exec':{
        post:     voteOperator.exec
      },
      '/status':{
        post:     voteOperator.query
      },
      '/vote':{
        get:      voteOperator.renderVoteFormView,
        post:     voteOperator.collect,
        '/:project': {
          get:    voteOperator.search
        }
      },
      '/result':{
        post:     voteOperator.result
      },
      '/result?:project':{
        get:      voteOperator.renderResultView
      }
    }
  }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
