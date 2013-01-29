var _ = require('underscore');
var Director = require('../models/director');

var ProjectMgr = ProjectMgr || {};

// data is fake here. In the next step, the data would
// fetch from project database
ProjectMgr.data = [
  {id: '0231', key: 'leo', name: 'McDonalds Spring Promotion'}, 
  {id: '0266', key: 'leo', name: 'P&G Promotion'}
];

ProjectMgr.accessQueue = new Array();

ProjectMgr.register = function(project, fn){
  var find = _.where(ProjectMgr.data, project);
  if (find.length == 0) return fn(new Error());

  var projectInfo = find[0];

  var check = _.find(ProjectMgr.accessQueue, function(d){
    return d.project.id == project.id;
  });
  
  if (check) {
    return fn(new Error('Exist'));
  }else{
    var director = new Director(projectInfo);
    ProjectMgr.accessQueue.push(director);
    return fn(null, director);
  }
}

ProjectMgr.getDirector = function(project){
  var check = _.find(ProjectMgr.accessQueue, function(d){
    return d.project.id == project.id;
  });
  return check;
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
exports.getDirector = ProjectMgr.getDirector;
exports.accessQueue = ProjectMgr.accessQueue;