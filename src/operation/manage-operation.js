/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

// Declare required lib
var _     = require('underscore');
var path  = require("path");
var fs    = require("fs");
var ObjectID = require('mongodb').ObjectID;

var projectDataMgr = require('../models/data-manager/project-data-manager');
var candidateDataMgr = require('../models/data-manager/candidate-data-manager');
var userDataMgr = require('../models/data-manager/user-data-manager');

var mgr = {
  'project': projectDataMgr,
  'candidate': candidateDataMgr,
  'user': userDataMgr
}

var ManageOperation = exports = module.exports = {};
var admin, passwd;

/**
 * Obtain the admin name and passwd for management login
 * It operates on the initialization
 *
 * @api private
 * @see http://nodejs.org/api/path.html#path_path_relative_from_to
 */
function admin() {
  var filename = path.resolve(__dirname, '../conf.json');
  path.exists(filename, function(exists){
    if (exists) {
      fs.readFile(filename, "binary", function(err, file) {    
        if (!err) {
          var conf = JSON.parse(file);
          admin = conf.admin;
          passwd = conf.password;
        };
      });
    };
  });
}

/**
 * Check Authentication
 *
 * @param{Request}
 *
 * @Return{boolean}
 *
 * @api private
 */
function isAuth(req) {
  if (req.session && req.session.admin) return true;
  else return false;
}

admin();

/**
 * Process client submitted data
 *
 * @param{Request}
 * @param{Response}
 * @param{String} keyword for submitted data
 * @param{Function} callback function(data){}
 *
 * @api private
 */
function process(req, res, key, fn){
  var data = req.body[key];
  if (data) {
    fn(data);
  }else{
    res.json({error: 'Lost submitted data'});
  }
}

/**
 * Login management system
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.login = function(req, res){
  if(isAuth(req)) return res.json({error: 'Already sign in Management System'});

  var username = req.body['username'];
  var password = req.body['password'];

  // It's not safe here. Passwd should be encrypt
  if (username == admin && password == passwd) {
    req.session.regenerate(function(){
      req.session.admin = admin;
      res.json({success:true, redirect:'/management/project'});
    });
  }else{
    res.json({error: 'Management Login Error'});
  }
}

/**
 * Logout management system
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.logout = function(req, res){
  req.session.destroy(function(){
    res.json({success: true, redirect:'/management'});
  });
}

/**
 * Render management view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.render = function(req, res){

  if (req.session) {
    if (req.session.project) {
      return res.redirect('/director');
    }else if(req.session.user){
      return res.redirect('/');
    }
  };

  switch(req.route.path){
    case '/management': 
      if(isAuth(req)) return res.redirect('/management/project');
      if (admin && passwd) return res.render('main');
    default:
      if(!isAuth(req)) return res.redirect('/management');
      // var module = req.params.module;
      return res.render('main');
  }
}

/**
 * render management view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.queryAll = function(req, res){
  if(!isAuth(req)) return res.redirect('/management');

  var module = req.params.module;
  var operator = mgr[module];
  operator.query({}, function(err, records){
    if (!err && records) res.json({records: records});
    else res.json({error: true});
  });
}

ManageOperation.query = function(req, res){
  if(!isAuth(req)) return res.redirect('/management');

  var module = req.params.module;
  var operator = mgr[module];

  var keyword = req.body['keyword'];
  operator.query(keyword, function(err, records){
    if (!err && records) res.json({records: records});
    else res.json({error: true});
  });
}

/**
 * Add record to specified module database
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.add = function(req, res){
  if(!isAuth(req)) return res.json({error: 'Authentication Failed'});

  var module = req.params.module;
  process(req, res, module, function(data){
    mgr[module].add(data, function(err){
      if(err) res.json({error: 'Add '+module+' failed'});
      else  res.json({success: true});
    })
  });
}

/**
 * Remove record from specified module database
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.remove = function(req, res){
  if(!isAuth(req)) return res.json({error: 'Authentication Failed'});

  var module = req.params.module;

  process(req, res, module, function(data){
    var obj = data;
    if (data && data._id) {
      obj = {_id: new ObjectID(data._id)};
    };
    mgr[module].remove(obj, function(err){
      if (err)  res.json({error: 'Remove '+module+' failed'});
      else  res.json({success: true});
    });
  });
}

/**
 * Query candidates in project
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.queryProjectCandidates = function(req, res){
  if(!isAuth(req)) return res.json({error: 'Authentication Failed'});

  var module = req.params.module;
  if (module != 'project') return res.send(404);

  process(req, res, 'project', function(project){
    projectDataMgr.query(project, function(err, records){
      if (!err && records) {
        var candidateArr = records[0].candidates;
        var sen = new Array();
        _.each(candidateArr, function(el, index, list){
          sen.push({_id: new ObjectID(el)});
        });

        if(sen.length == 0) return res.json({candidates: []});

        candidateDataMgr.query({$or: sen}, function(err, records){
          if (!err && records) res.json({candidates: records});
          else res.json({error: true});
        });
      };
    });
  });
}

/**
 * Remove candidate from specified project
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.removeCandidateFromProject = function(req, res){
  if(!isAuth(req)) return res.json({error: 'Authentication Failed'});

  var module = req.params.module;
  if (module != 'project') return res.send(404);

  var candidate = req.body['candidate'];
  var project = req.body['project'];

  if (candidate && project) {
    projectDataMgr.removeCandidate(project, candidate._id, function(err){
      console.log(err);
      if (err)  res.json({error: 'Remove candidate failed'});
      else  res.json({success: true});
    });
  }else{
    res.json({error: 'Lost submitted data'});
  }
}

/**
 * Add candidate into specified project
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.insertCandidateIntoProject = function(req, res){
  if(!isAuth(req)) return res.json({error: 'Authentication Failed'});

  var module = req.params.module;
  if (module != 'project') return res.send(404);

  var candidate = req.body['candidate'];
  var project = req.body['project'];

  if (candidate && project) {
    projectDataMgr.insertCandidate(project, candidate._id, function(err){
      if (err)  res.json({error: 'Add candidate failed'});
      else  res.json({success: true});
    });
  }else{
    res.json({error: 'Lost submitted data'});
  }
}
