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


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir:'./public/uploads'}));
app.use(express.methodOverride());
app.use(express.cookieParser('leobrunett_gpc'));
app.use(express.session());
app.use(app.router);

app.use(express.directory(path.join(__dirname, 'public')));
app.use(require('less-middleware')({ src: path.join(__dirname, 'public','less'),compress: true }));
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
};

// Route map
app.map({
  '/':{
    get:          userOperator.render,
    'home':{
      get:        userOperator.render
    },
    'login':{
      get:        userOperator.render,
      post:       userOperator.login
    },
    'code/:id':{
      get:        userOperator.requestVerifiedCode
    },
    'forgot':{
      get:        userOperator.render,
      post:       userOperator.requestResetPassword,
      '/:id':{
        get:      userOperator.render,
        post:     userOperator.reset
      }
    },
    'logout':{
      get:        userOperator.logout
    },
    'register':{
      get:        userOperator.render,
      post:       userOperator.register
    },
    'user':{
      '/project': {
        post:     voteOperator.accessedProject
      }
    },
    'upload':{
      post:       manageOperator.upload
    },
    'management':{
      get:        manageOperator.render,
      '/login': {
        post:     manageOperator.login
      },
      '/logout': {
        get:      manageOperator.logout
      },
      '/release':{
        post:     voteOperator.release
      },
      '/export/:id':{
        get:     manageOperator.exportDataToFile
      },
      '/:module': {
        get:      manageOperator.render,
        post:     manageOperator.add,
        '/all': {
          get:    manageOperator.queryAll
        },
        '/:id': {
          delete: manageOperator.remove,
          get:    manageOperator.query,
        },
        '/candidates/:projectId': {
          get:  manageOperator.render,
          '/all':{ 
            get: manageOperator.queryProjectCandidates 
          },
          '/:candidateId':{
            delete:   manageOperator.removeCandidateFromProject,
            put:      manageOperator.insertCandidateIntoProject,
          },
        }
      }
    },
    'director':{
      get:        voteOperator.render,
      '/login':{
        get:      voteOperator.render,
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
        post:     voteOperator.collect,
        '/:project': {
          get:    voteOperator.render
        },
      },
      '/result/:project':{
        get:      voteOperator.render
      }
    }
  }
});
process.on('uncaughtException', function(err) {
    console.log("Uncaught exception!", err);
});
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
