var projectDataMgr = require('../models/project-data-manager');

var ManageOperation = exports = module.exports = {};

function process(req, res, key, fn){
  var data = req.body[key];
  if (data) {
    fn();
  }else{
    res.json({error: 'Lost submitted data'});
  }
}

ManageOperation.setProjectList = function(req, res){
  res.render('management-projects');
}

ManageOperation.queryAllProjects = function(req, res){
  process(req, res, 'project', function(){
    projectDataMgr.queryAll(function(err, list){
      if (list) res.json({projects: list});
      else res.json({error: true});
    });
  });
}

ManageOperation.addProject = function(req, res){
  process(req, res, 'project', function(){
    projectDataMgr.query({id: project.id}, function(err, docs){
      if (!err && docs.length == 0) {
        projectDataMgr.add(project, function(err){
          if(err) res.json({error: 'Add project failed'});
          else res.json({success:true});
        });
      }else{
        res.json({error: 'Project Exist'});
      }
    });
  });
}

ManageOperation.removeProject = function(req, res){
  process(req, res, 'project', function(){
    projectDataMgr.remove(project, function(err){
      if (err)  res.json({error: 'Remove project failed'});
      else  res.json({success: true});
    });
  });
}

ManageOperation.queryProject = function(req, res){
  process(req, res, 'project', function(){
    projectDataMgr.query(project, function(err, docs){
      if (!err && docs.length > 0)  res.json(docs[0]);
      else  res.json({error: 'No candidate found'});
    });
  });
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
    projectMgr.add(project, function(err){
      if (err) res.json({error: true});
      else res.json({success: true});
    });
  }else
    res.json({error: true});
}

ManageOperation.removeProject = function(req, res){
  var project = req.body['project'];
  projectMgr.remove(project, function(err){
    if (err) res.json({error: true});
    else res.json({success: true});
  });
}

ManageOperation.queryAllProjects = function(req, res){
  projectMgr.queryAll(function(err, list){
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

*/