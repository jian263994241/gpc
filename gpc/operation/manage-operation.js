var projectMgr = require('../models/project-manager');
var candidateDataMgr = require('../models/candidate-data-manager');

var ManageOperation = ManageOperation || {};

ManageOperation.setProjectList = function(req, res){
  res.render('management-projects');
}

ManageOperation.setCandidates = function(req, res){
  res.render('management-candidates');
}

ManageOperation.addProject = function(req, res){
  var project = req.body['project'];
  if (project) {
    projectMgr.addProject(project, function(err){
      if (err) res.json({error: true});
      else res.json({success: true});
    });
  }else
    res.json({error: true});
}

ManageOperation.removeProject = function(req, res){
  var project = req.body['project'];
  projectMgr.removeProject(project, function(err){
    if (err) res.json({error: true});
    else res.json({success: true});
  });
}

ManageOperation.queryAllProjects = function(req, res){
  projectMgr.queryProject(function(err, list){
    if (list) res.json({projects: list});
    else res.json({error: true});
  });
}

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