/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

// Declare required lib
var Director            = require('./director');
var ProjectExistError   = require('./error/project-exist-error');
var ProjectNoExistError = require('./error/project-no-exist-error');

var projectDataMgr      = require('./data-manager/project-data-manager');
var _                   = require('underscore');

// Declare namespace ProjectMgr
var ProjectMgr = exports = module.exports = {};

// Store all working director
ProjectMgr.accessQueue = new Array();

/**
 * Check whether project work, generate director
 * and bind it into access queue
 * 
 * @param {JSON} project data object
 * @param {Function} {error, director} callback
 *
 * @api public 
 */
ProjectMgr.register = function(project, fn){
  projectDataMgr.query(project, function(err, docs){
    if (err) {
      return fn(err);
    }else if(docs.length == 0){
      return fn(new ProjectNoExistError());
    }

    var p = docs[0];
    var check = _.find(ProjectMgr.accessQueue, function(d){
      return d.project._id == p._id;
    });

    if (check) {
      return fn(new ProjectExistError());
    }else{
      var director = new Director(p);
      ProjectMgr.accessQueue.push(director);
      return fn(null, director);
    }
  });
}

/**
 * Unbind director from access queue
 * 
 * @param {JSON} director data object
 * @param {Function} {error} callback
 *
 * @api public 
 */
ProjectMgr.unregister = function(director, fn){
  ProjectMgr.accessQueue = _.without(ProjectMgr.accessQueue, director);
  return fn(null);
}

/**
 * Obtain director from access queue
 * 
 * @param {JSON} project data object
 *
 * @return boolean
 */
ProjectMgr.getDirector = function(project){
  var check = _.find(ProjectMgr.accessQueue, function(d){
    return d.project.id == project.id;
  });
  return check;
}