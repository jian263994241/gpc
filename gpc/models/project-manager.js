var _ = require('underscore');

var ProjectMgr = ProjectMgr || {};

// data is fake here. In the next step, the data would
// fetch from project database
ProjectMgr.data = [{id: '0231', key: 'leo', name: 'McDonalds Spring Promotion'}];

ProjectMgr.accessQueue = new Array();

ProjectMgr.register = function(project, fn){
  var find = _.where(ProjectMgr.data, project);
  if (find.length == 0) return fn(new Error());

  var check = _.where(ProjectMgr.accessQueue, project)
  if(check.length > 0) return fn(new Error());
  else {
    ProjectMgr.accessQueue.push(find[0]);
    return fn(null, find[0]);
  }
}

ProjectMgr.unregister = function(projectId, fn){
  if(_.contains(ProjectMgr.accessQueue, projectId)){
    ProjectMgr.accessQueue = _.without(ProjectMgr.accessQueue, projectId);
    return fn(null, true);
  }else{
    return fn(new Error());
  }
}

exports.register = ProjectMgr.register;
exports.unregister = ProjectMgr.unregister;
exports.accessQueue = ProjectMgr.accessQueue;