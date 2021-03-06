/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

// Declare required lib
var _     = require('underscore');
var path  = require("path");
var fs    = require("fs");
var crypto = require("crypto");
var xlsx = require("node-xlsx");
var ObjectID = require('mongodb').ObjectID;

var ProjectDataMgr = require('../models/data-manager/project-data-manager');
var CandidateDataMgr = require('../models/data-manager/candidate-data-manager');
var UserDataMgr = require('../models/data-manager/user-data-manager');
var MarkDataMgr = require('../models/data-manager/mark-data-manager');
var IpDataMgr   = require('../models/data-manager/ip-data-manager');
var DataExistError = require('../models/error/data-exist-error');

var ManageOperation = exports = module.exports = {};

var projectDataMgr    = new ProjectDataMgr();
var candidateDataMgr  = new CandidateDataMgr();
var userDataMgr       = new UserDataMgr();
var markDataMgr       = new MarkDataMgr();
var ipDataMgr         = new IpDataMgr();
var mgr = {
  'project': projectDataMgr,
  'candidate': candidateDataMgr,
  'user': userDataMgr,
  'ip' : ipDataMgr
}

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

function exportData (data, res) {
  var buffer = xlsx.build(data);
  
  crypto.randomBytes(16, function(ex, buf){
    var token = buf.toString('hex');
    var filename = path.resolve(__dirname, '../public/files/'+token+'.xlsx');
    var callback = function(err){
      if (err) {
        console.error(err.stack);
        res.json({error: 'Fail to export data'});
      }else {
        console.log('save success');
        res.json({link: '/files/'+token+'.xlsx'});
      }
    }
    fs.writeFile(filename, buffer, callback);
  });
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
    if (!err && records){
        if(module==="user") {
            var data = [];
            mgr['ip'].query({},function(err, user_ip){
                if(!err){
                    _.each(records,function(s,i){
                        var _a = _.findWhere(user_ip,{username:s.username});
                        data.push({
                            username :s.username,
                            _id: s._id,
                            ip : _a?_a.address:null,
                            _aid : _a?_a._id:null
                        });
                    });
                    res.json({records: data});
                }
            });
        }else{
            res.json({records: records});
        }
    } else res.json({error: true});
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
  if(!_id) return ;
  obj = {_id: new ObjectID(_id)};

  mgr[module].remove(obj, function(err){
    if (err)  res.json({error: 'Remove '+module+' failed'});
    else {
        if(module=='project'){
            markDataMgr.remove({project:obj._id});
        }else if(module=='candidate'){
            markDataMgr.remove({candidate:obj._id});
        }
        res.json({success: true});
    }
  });
}

function formatData (obj) {
  var excel = { worksheets:[{ name: "project", data: [] }] };
  var body = excel.worksheets[0].data;
  body.push(["project id", "project name"]);
  body.push([obj.project.id, obj.project.name]);

  body.push(["candidate title", "candidate author", "candidate introduction", "score"]);
  _.each(obj.candidates, function(el, index, list){
    body.push([
      {value: el.title, formatCode: 'General'},
      {value: el.author, formatCode: 'General'},
      {value: el.intro, formatCode: 'General'},
      {value: el.score, formatCode: 'General'}
    ]);
  });

  return excel;
}

ManageOperation.exportDataToFile = function(req, res){
  // if(!isAuth(req)) return res.json({error: 'Authentication Failed'});
  
  var id = req.params.id;
  obj = {id: id};

  var data = {
    project: {
      _id: 0,
      name:'', 
      id: ''
    },
    candidates:[]
  }

  var queryMarksCallback = function(err, records){

    _.each(records, function(el){
      var found = _.find(data.candidates, function(element){
        return element._id.toString() == el.candidate.toString();
      });
      if (found) {
        found.score = el.average;
      }
    });

    var formattedData = formatData(data);
    exportData(formattedData, res);
  }

  var queryCandidatesCallback = function(err, records){
    var sen = new Array();
    data.candidates = records;

    _.each(records, function(el){
      sen.push({candidate: el._id, project: data.project._id});
    });

    markDataMgr.query({$or: sen}, queryMarksCallback);
  }

  var queryProjectCallback = function(err, records){
    var sen = new Array();

    data.project.id = records[0].id;
    data.project.name = records[0].name;
    data.project._id = records[0]._id;

    _.each(records[0].candidates, function(el, index, list){
      sen.push({_id:new ObjectID(el)});
    });

    candidateDataMgr.query({$or: sen}, queryCandidatesCallback);
  }

  projectDataMgr.query(obj, queryProjectCallback);
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

/**
 * Upload File to server
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.upload = function(req, res){
  if(!isAuth(req)) return res.json({error: 'Authentication Failed'});

  var uploadFile = req.files.files

  if (req.files.length > 0) {
    uploadFile = req.files.files[0];
  };
  moveUploadFile(uploadFile, function(err){
    if (err) {
      console.error(err.stack);
      return res.json({error: 'Can not upload!'});
    }
    return res.json({complete: EPLOAD_PATH+uploadFile.name});
  });
}

/**
 * Move upload file from tmp to upload
 *
 * @param{Request}
 * @param{Response}
 *
 * @api private
 */
function moveUploadFile (file, fn) {
  var tmp = file.path;
  var target = path.join(__dirname, '../public/uploads/'+file.name);
  fs.rename(tmp, target, function(err){
    if (err) fn(err);
    fs.unlink(tmp, function(){
      if (err) fn(err);
      fn();
    });
  });
}
