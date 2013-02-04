var dataMgr = require('./data-manager');

var ProjectDataManager = exports = module.exports = {};
ProjectDataManager.key = dataMgr.COLLETION_PROJECT;

ProjectDataManager.queryProject = function(project, fn){

}

/**
 * Get all projects from database
 *
 * @param{Function} callback function(collection, close){} (close is handler to close the server)
 *
 * @api public
 *
 */
ProjectDataManager.queryAllProjects = function(fn) {
  dataMgr.openCollection(ProjectDataManager.key, function(collection, close){
    collection.find().toArray(function(err, data){
      fn(err, data.concat());
      close();
    });
  });
}

// ProjectDataManager.queryProject = function(project, fn){
//   ProjectDataManager.db.find(project, fn);
// }

// ProjectDataManager.queryAllProjects = function(fn) {
//   ProjectDataManager.db.find(null, fn); 
// }

// ProjectDataManager.addProject = function(project, fn){
//   ProjectDataManager.db.save(project, fn);
// }

// ProjectDataManager.removeProject = function(project, fn){
//   ProjectDataManager.db.remove(project, fn);
// }

// ProjectDataManager.addCandidate = function(project, candidateId, fn){
//   ProjectDataManager.db.update({id: project.id}, {$push: {candidates: candidateId}}, {upsert: true, multi: false}, fn);
// }