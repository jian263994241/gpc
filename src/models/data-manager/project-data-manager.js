/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

var DataMgr         = require('./data-manager');
var DataExistError  = require('../error/data-exist-error');
var ObjectID        = require('mongodb').ObjectID;
var events          = require('events');
var emitter         = new events.EventEmitter();
var util            = require('util');

var ProjectDataManager = module.exports = function(config){
  DataMgr.call(this, config);
  this.key = this.COLLECTION_PROJECT;
}
util.inherits(ProjectDataManager, DataMgr);

/**
 * Query specified projects from GPC_DB.projects
 *
 * @param {JSON} project data object
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
ProjectDataManager.prototype.query = function(project, fn) {
  var cEvent = 'project.data.query.error';
  DataMgr.prototype.query.call(this, cEvent, project, fn);
};

/**
 * Insert project into GPC_DB.projects
 *
 * @param {JSON} project data object
 * @param {Function} callback function(err, records){}
 *
 * @api public
 */
ProjectDataManager.prototype.add = function(project, fn){
  var that = this;
  var cEvent = 'project.data.add.error';
  var cListener = function(err){
    console.error(err.stack);
    fn(err);
    emitter.removeListener(cEvent, cListener);
    that.closeDbServer(db);
  }
  emitter.once(cEvent, cListener);
  var trigger = function(err){
    emitter.emit(cEvent, err);
  }

  this.connectDbServer(this.COLLECTION_PROJECT, trigger, function(collection,db){
    collection.find({id: project.id}).toArray(function(err, data){
      if (err) return trigger(err);
      else if(data.concat().length>0)
        return trigger(new DataExistError());
      else{
        var insertCallback = function(err, records){
          if (err) return trigger(err);
          
          fn(err, records);
          emitter.removeListener(cEvent, cListener);
          that.closeDbServer(db);
        }
        collection.insert(project, {safe: true}, insertCallback);
      }
    });
  });
}

ProjectDataManager.prototype.update = function(project, data, fn) {
  var cEvent = 'project.data.update.error';
  DataMgr.prototype.update.call(this, cEvent, project, dataMgr, fn);
};

/**
 * Remove project from GPC_DB.projects
 *
 * @param {JSON} project data object
 * @param {Function} callback function(err){}
 *
 * @api public
 */
ProjectDataManager.prototype.remove = function(project, fn) {
  var cEvent = 'project.data.remove.error';
  DataMgr.prototype.remove.call(this, cEvent, project, fn);
};

/**
 * Insert candidateId into specified project in GPC_DB.projects
 *
 * @param {JSON} project data object
 * @paran {String} candidateId
 * @param {Function} callback function(err){}
 *
 * @api public
 * @see http://docs.mongodb.org/manual/applications/update/
 * @see http://mongodb.github.com/node-mongodb-native/api-articles/nodekoarticle1.html
 */
ProjectDataManager.prototype.insertCandidate = function(project, candidateId, fn){
  var that = this;
  var cEvent = 'project.data.insert.candidate.error';
  var cListener = function(err){
    console.error(err.stack);
    fn(err);
    emitter.removeListener(cEvent, cListener);
    that.closeDbServer(db);
  }
  emitter.once(cEvent, cListener);
  var trigger = function(err){
    emitter.emit(cEvent, err);
  }

  this.connectDbServer(this.COLLECTION_PROJECT, trigger, function(collection,db){
    collection.update(project, {$addToSet: {candidates: candidateId}}, {upsert: true}, function(err){
      if (err) return trigger(err);

      fn(err);
      emitter.removeListener(cEvent, cListener);
      that.closeDbServer(db);
    });
  });
}

/**
 * Remove candidateId from specified project in GPC_DB.projects
 *
 * @param {JSON} project data object {_id}
 * @paran {String} candidateId
 * @param {Function} callback function(err){}
 *
 * @api public
 * @see http://docs.mongodb.org/manual/applications/update/
 * @see http://mongodb.github.com/node-mongodb-native/api-articles/nodekoarticle1.html
 */
ProjectDataManager.prototype.removeCandidate = function(project, candidateId, fn){
  var that = this;
  var cEvent = 'project.data.remove.candidate.error';
  var cListener = function(err){
    console.error(err.stack);
    fn(err);
    emitter.removeListener(cEvent, cListener);
    that.closeDbServer(db);
  }
  emitter.once(cEvent, cListener);
  var trigger = function(err){
    emitter.emit(cEvent, err);
  }

  this.connectDbServer(this.COLLECTION_PROJECT, trigger, function(collection,db){
    collection.update(project, {$pull: {candidates: candidateId}}, {upsert: true}, function(err){
      if (err) trigger(err);
      fn(err);
      emitter.removeListener(cEvent, cListener);
      that.closeDbServer(db);
    });
  }); 
}