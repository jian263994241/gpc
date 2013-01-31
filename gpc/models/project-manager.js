var _ = require('underscore');
var Director = require('./director');

var projectDataMgr = require('./project-data-manager');

var ProjectMgr = ProjectMgr || {};

ProjectMgr.data = new Array();
ProjectMgr.accessQueue = new Array();

ProjectMgr.query = function(fn){
  projectDataMgr.queryAllProjects(fn);
}

ProjectMgr.register = function(project, fn){
  ProjectMgr.query(function(err, docs){

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

// ProjectMgr.unregister = function(projectId, fn){
//   if(_.contains(ProjectMgr.accessQueue, projectId)){
//     ProjectMgr.accessQueue = _.without(ProjectMgr.accessQueue, projectId);
//     return fn(null, true);
//   }else{
//     return fn(new Error());
//   }
// }
ProjectMgr.unregister = function(director, fn){
  console.log('**************unregister**************');
  console.log(ProjectMgr.accessQueue);
  ProjectMgr.accessQueue = _.without(ProjectMgr.accessQueue, director);
  console.log('**************unregister after**************');
  return fn(null);
}

ProjectMgr.add = function(project, fn){
  projectDataMgr.addProject(project, fn);
}

ProjectMgr.del = function(project, fn){
  projectDataMgr.removeProject(project, fn);
}

exports.register = ProjectMgr.register;
exports.unregister = ProjectMgr.unregister;
exports.getDirector = ProjectMgr.getDirector;
exports.accessQueue = ProjectMgr.accessQueue;
exports.queryProject = ProjectMgr.query;
exports.addProject = ProjectMgr.add;
exports.removeProject = ProjectMgr.del;