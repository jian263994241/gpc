var dataMgr = require('./data-manager');

var ProjectDataManager = exports = module.exports = {};
ProjectDataManager.db = dataMgr.table.projects;

ProjectDataManager.queryProject = function(project, fn){
  ProjectDataManager.db.find(project, fn);
}

ProjectDataManager.queryAllProjects = function(fn) {
  ProjectDataManager.db.find(null, fn); 
}

ProjectDataManager.addProject = function(project, fn){
  ProjectDataManager.db.save(project, fn);
}

ProjectDataManager.removeProject = function(project, fn){
  ProjectDataManager.db.remove(project, fn);
}

ProjectDataManager.addCandidate = function(project, candidate, fn){
  ProjectDataManager.db.update({id: project.id}, {$push: {candidates: candidate}}, {upsert: true, multi: false}, fn);
}

ProjectDataManager.queryCandidate = function(project, candidate, fn){
  
}