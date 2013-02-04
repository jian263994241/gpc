var _ = require('underscore');
var Director = require('./director');

var projectDataMgr = require('./project-data-manager');

var ProjectMgr = exports = module.exports = {};

ProjectMgr.data = new Array();
ProjectMgr.accessQueue = new Array();

ProjectMgr.queryAll = function(fn){
  projectDataMgr.queryAll(fn);
}

ProjectMgr.register = function(project, fn){
  ProjectMgr.queryAll(function(err, docs){

    if (err) return fn(new Error('Exist'));

    ProjectMgr.data = docs;

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
  });
}

ProjectMgr.getDirector = function(project){
  var check = _.find(ProjectMgr.accessQueue, function(d){
    return d.project.id == project.id;
  });
  return check;
}

ProjectMgr.unregister = function(director, fn){
  ProjectMgr.accessQueue = _.without(ProjectMgr.accessQueue, director);
  return fn(null);
}

ProjectMgr.add = function(project, fn){
  projectDataMgr.add(project, fn);
}

ProjectMgr.remove = function(project, fn){
  projectDataMgr.remove(project, fn);
}