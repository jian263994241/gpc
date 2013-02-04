var projectDataMgr = require('../models/data-manager/project-data-manager');

var ManageOperation = exports = module.exports = {};

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
 * Render 'management-project' view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.setProjectList = function(req, res){
  res.render('management-projects');
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
  process(req, res, 'project', function(project){
    projectDataMgr.addProject(project, function(err){
      if (err)  res.json({error: 'Add project failed'});
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
  process(req, res, 'project', function(project){
    projectDataMgr.removeProject(project, function(err){
      if (err)  res.json({error: 'Remove project failed'});
      else  res.json({success: true});
    });
  });
}

ManageOperation.setCandidates = function(req, res){
  res.render('management-candidates');
}

ManageOperation.queryAllCandidates = function(req, res){
  
}

ManageOperation.addCandidate = function(req, res) {
  process(req, res, 'candidate', function(){

  });
  // var candidate = req.body['candidate'];
  // if (candidate) 
  //   candidateDataMgr.addCandidate(candidate, function(err){
  //     if (err) res.json({error: true});
  //     else res.json({success: true});
  //   })
  // else res.json({error: true});
}

// var projectMgr = require('../models/project-manager');
// var candidateDataMgr = require('../models/candidate-data-manager');

/*
ManageOperation.queryProjectCandidate = function(req, res){
  var project = req.body['project'];
  candidateDataMgr.queryCandidate({project: project}, function(err, docs){
    if (!err && docs) {
      res.json({candidates: docs});
    }else res.json({error: true});
  });
}

ManageOperation.addCandidate = function(req, res) {
  var candidate = req.body['candidate'];
  if (candidate) 
    candidateDataMgr.addCandidate(candidate, function(err){
      if (err) res.json({error: true});
      else res.json({success: true});
    })
  else res.json({error: true});
}

ManageOperation.removeCandidate = function(req, res){
  var candidate = req.body['candidate'];
  candidateDataMgr.removeProject(candidate, function(err){
    if (err) res.json({error: true});
    else res.json({success: true});
  });
}

exports.setProjectList = ManageOperation.setProjectList;
exports.addProject = ManageOperation.addProject;
exports.queryAllProjects = ManageOperation.queryAllProjects;
exports.removeProject = ManageOperation.removeProject;
exports.setCandidates = ManageOperation.setCandidates;

exports.queryProjectCandidate = ManageOperation.queryProjectCandidate;
exports.addCandidate = ManageOperation.addCandidate;
exports.removeCandidate = ManageOperation.removeCandidate;

*/