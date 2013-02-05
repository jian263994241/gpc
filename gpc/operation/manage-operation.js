/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

var _     = require('underscore');
var path  = require("path");
var fs    = require("fs");
var ObjectID = require('mongodb').ObjectID;

var projectDataMgr = require('../models/data-manager/project-data-manager');
var candidateDataMgr = require('../models/data-manager/candidate-data-manager');

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
 * Render 'projects' view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.setProjectList = function(req, res){
  if(!isAuth(req)) return res.redirect('/management');

  res.render('projects', {
    project_status: 'active',
    candidate_status: '',
    modal_id: 'project-modal',
    modal_type: 'New Project',
  });
}

/**
 * Query all projects data and response json data
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.queryAllProjects = function(req, res){
  if(!isAuth(req)) return res.json({error: 'Authentication Failed'});

  projectDataMgr.queryAllProjects(function(err, records){
    if (!err && records) res.json({projects: records});
    else res.json({error: true});
  });
}

/**
 * Add project and response operation status
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.addProject = function(req, res){
  if(!isAuth(req)) return res.json({error: 'Authentication Failed'});

  process(req, res, 'project', function(project){
    project.candidates = new Array();
    projectDataMgr.addProject(project, function(err){
      if(err) res.json({error: 'Add project failed'});
      else  res.json({success: true});
    });
  });
}

/**
 * Remove project and response operation status
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.removeProject = function(req, res){
  if(!isAuth(req)) return res.json({error: 'Authentication Failed'});

  process(req, res, 'project', function(project){
    projectDataMgr.removeProject(project, function(err){
      if (err)  res.json({error: 'Remove project failed'});
      else  res.json({success: true});
    });
  });
}

/**
 * Render 'candidates' view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.setCandidates = function(req, res){
  if(!isAuth(req)) return res.redirect('/management');

  res.render('candidates', {
    project_status: '',
    candidate_status: 'active',
    modal_id: 'candidate-modal',
    modal_type: 'New Candidate'
  });
}

/**
 * Query all candidates data and response json data
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.queryAllCandidates = function(req, res){
  if(!isAuth(req)) return res.json({error: 'Authentication Failed'});

  candidateDataMgr.queryAllCandidates(function(err, records){
    if (!err && records) res.json({candidates: records});
    else res.json({error: true});
  });
}

/**
 * Add candidate and response operation status
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.addCandidate = function(req, res) {
  if(!isAuth(req)) return res.json({error: 'Authentication Failed'});

  process(req, res, 'candidate', function(candidate){
    candidateDataMgr.addCandidate(candidate, function(err){
      if (err)  res.json({error: 'Add candidate failed'});
      else  res.json({success: true});
    });
  });
}

/**
 * Remove candidate and response operation status
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 * @see https://github.com/mongodb/node-mongodb-native/#data-types
 */
ManageOperation.removeCandidate = function(req, res){
  if(!isAuth(req)) return res.json({error: 'Authentication Failed'});

  process(req, res, 'candidate', function(candidate){
    candidateDataMgr.removeCandidate({_id: new ObjectID(candidate._id)}, function(err){
      if (err)  res.json({error: 'Remove candidate failed'});
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

  process(req, res, 'project', function(project){
    projectDataMgr.queryProject(project, function(err, records){
      if (!err && records) {
        var candidateArr = records[0].candidates;
        var sen = new Array();
        _.each(candidateArr, function(el, index, list){
          sen.push({_id: new ObjectID(el)});
        });

        if(sen.length == 0) return res.json({candidates: []});

        candidateDataMgr.queryCandidate({$or: sen}, function(err, records){
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

/**
 * Render login mangement view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.renderLoginManagementView = function(req, res){
  if(isAuth(req)) return res.redirect('/management/project');

  if (admin && passwd) {
    res.render('login', {
      js_control_file: 'management/login',
      is_need: false,
      guide_link: '',
      guide_link_title: '',
      username_title: 'Admin',
      password_title: 'Password',
      submit_button_title: 'Submit',
      is_need_remember: false
    });
  };
}

/**
 * login management system
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.loginManagement = function(req, res){
  if(isAuth(req)) return res.json({error: 'Already sign in Management System'});

  var username = req.body['username'];
  var password = req.body['password'];

  // It's not save here. Passwd should be encrypt
  if (username == admin && password == passwd) {
    req.session.regenerate(function(){
      req.session.admin = admin;
      res.json({success:true, redirect:'management/project'});
    });
  }else{
    res.json({error: 'Management Login Error'});
  }
}

/**
 * logou management system
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.logoutManagement = function(req, res){
  if(isAuth(req)) 
    req.session.destroy(function(){
      res.redirect('management');
    });
  else
    res.redirect('management');
}

/**
 * Render 'project-candidates' view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.setProjectCandidates = function(req, res){
  if(!isAuth(req)) return res.redirect('/management');

  var projectId = req.params.projectId;
  projectDataMgr.queryProject({id:projectId}, function(err, records){
    if (!err && records) {
      res.render('project-candidates', {
        project_status: '',
        candidate_status: '',
        modal_id: 'select-candidate-modal',
        modal_type: 'Add Candidate',
        project_id: records[0].id,
        project_title: records[0].name,
      });
    };
  });
}