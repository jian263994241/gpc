var _ = require('underscore');

var ProjectMgr = ProjectMgr || {};

ProjectMgr.projectContainer = new Array();

ProjectMgr.register = function(projectId, fn){
  if(_.contains(ProjectMgr.projectContainer, projectId)) return fn(new Error());
  else return fn(null, true);
}

ProjectMgr.unregister = function(projectId, fn){
  if(_.contains(ProjectMgr.projectContainer, projectId)){
    ProjectMgr.projectContainer = _.without(ProjectMgr.projectContainer, projectId);
    return fn(null, true);
  }else{
    return fn(new Error());
  }
}

exports.register = ProjectMgr.register;
exports.unregister = ProjectMgr.unregister;