var dataMgr = require('./data-manager');

var ProjectDataManager = ProjectDataManager || {};
ProjectDataManager.db = dataMgr.table.projects;

ProjectDataManager.queryAll = function(fn) {
  ProjectDataManager.db.find(fn); 
}

ProjectDataManager.addProject = function(project, fn){
  ProjectDataManager.db.find(project, function(err, docs){
    if (!err){
      if (docs && docs.length > 0) fn(new Error('Exist'));
      else ProjectDataManager.db.save(project, fn);
    }else fn(err);
  });
}

ProjectDataManager.removeProject = function(project, fn){
  ProjectDataManager.db.remove(project, fn);
}

exports.queryAllProjects = ProjectDataManager.queryAll;
exports.addProject = ProjectDataManager.addProject;
exports.removeProject = ProjectDataManager.removeProject;