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
var DataExistError = require('../models/error/data-exist-error');

var mgr = {
  'project': projectDataMgr,
  'candidate': candidateDataMgr,
  'user': userDataMgr
}

var ManageOperation = exports = module.exports = {};
var admin, passwd;
var EPLOAD_PATH = '/uploads/';

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
      var readFileCallback = function(err, file) {    
        if (!err) {
          var conf = JSON.parse(file);
          admin = conf.admin;
          passwd = conf.password;
        }else console.error(err.stack);
      }
      fs.readFile(filename, "binary", readFileCallback);
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

  if (req.session)
    if (req.session.project) return res.redirect('/director');
    else if(req.session.user) return res.redirect('/');

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
  var _id = req.params.id;

  obj = {_id: new ObjectID(_id)};
  mgr[module].query(obj, function(err, records){
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
    var callback = function(err){
      if(err) 
        if(err instanceof DataExistError) res.json({error: 'Data existed'});
        else res.json({error: 'Add '+module+' failed'});
      else  res.json({success: true});
    }
    mgr[module].add(data, callback);
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
  var _id = req.params.id;

  obj = {_id: new ObjectID(_id)};
  mgr[module].remove(obj, function(err){
    if (err)  res.json({error: 'Remove '+module+' failed'});
    else  res.json({success: true});
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

  var _id = req.params.projectId;
  obj = {_id: new ObjectID(_id)};

  var callback = function(err, records){
    if (!err && records && records.length) {
      var candidateArr = records[0].candidates;
      console.log(candidateArr);
      var sen = new Array();
      _.each(candidateArr, function(el, index, list){
        sen.push({_id: new ObjectID(el)});
      });

      if(sen.length == 0) return res.json({candidates: []});

      var queryCallback = function(err, records){
        if (!err && records) res.json({candidates: records});
        else res.json({error: true});

        syncProjectCandidates(obj, candidateArr);
      }

      candidateDataMgr.query({$or: sen}, queryCallback);
    };
  }

  projectDataMgr.query(obj, callback);
}

/**
 * Not Good 
 * Templately sync project with candidates by hand
 *
 * @param {JSON} project data object
 * @param {JSON} candidate data object
 * 
 * @api private
 */
function syncProjectCandidates(project, candidates){
  _.each(candidates, function(el, index, list){
    var callback = function(err, records){
      if (!err && records && records.length == 0) {
        projectDataMgr.removeCandidate(project, el, function(){});
      };
    }
    candidateDataMgr.query({_id: new ObjectID(el)}, callback)
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

  var project = {_id: new ObjectID(req.params.projectId)};
  var candidateId = req.params.candidateId;

  if (candidateId && project) {
    projectDataMgr.removeCandidate(project, candidateId, function(err){
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

  var project = {_id: new ObjectID(req.params.projectId)};
  var candidate = req.body['candidate'];

  if (candidate && project) {
    projectDataMgr.insertCandidate(project, candidate._id, function(err){
      if (err)  res.json({error: 'Add candidate failed'});
      else  res.json({success: true});
    });
  }else{
    res.json({error: 'Lost submitted data'});
  }
}

ManageOperation.upload = function(req, res){
  var uploadFile = req.files.files
  console.log(uploadFile);
  if (req.files.length > 0) {
    uploadFile = req.files.files[0];
  };
  moveUploadFile(uploadFile, function(err){
    console.log(err);
    if (err) return res.json({error: 'Can not upload!'});
    // console.log(req.files);
    return res.json({complete: EPLOAD_PATH+uploadFile.name});
  });
}

function moveUploadFile (file, fn) {
  var tmp = file.path;
  var target = path.join(__dirname, '../public/uploads/'+file.name);
  console.log(tmp);
  console.log(target);
  fs.rename(tmp, target, function(err){
    if (err) fn(err);
    fs.unlink(tmp, function(){
      if (err) fn(err);
      fn();
    });
  });
}
