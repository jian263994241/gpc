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

ProjectDataManager.addCandidate = function(project, candidateId, fn){
  ProjectDataManager.db.update({id: project.id}, {$push: {candidates: candidateId}}, {upsert: true, multi: false}, fn);
}

ProjectDataManager.queryCandidate = function(candidateId, fn){
  
}