/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

var dataMgr         = require('./data-manager');
var DataExistError  = require('../error/data-exist-error');
var ObjectID        = require('mongodb').ObjectID;
var events          = require('events');
var emitter         = new events.EventEmitter();

var ProjectDataManager = exports = module.exports = {};
ProjectDataManager.key = dataMgr.COLLECTION_PROJECT;

/**
 * Query specified projects from GPC_DB.projects
 *
 * @param {JSON} project data object
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
ProjectDataManager.query = function(project, fn){
  var cEvent = 'project.data.query.error';
  var cListener = function(err){
    emitter.removeListener(cEvent, cListener);
    console.error(err.stack);
    fn(err);
    dataMgr.closeDbServer();
  }
  emitter.addListener(cEvent, cListener);
  var trigger = function(err){
    emitter.emit(cEvent, err);
  }

  dataMgr.connectDbServer(ProjectDataManager.key, trigger, function(collection){
    collection.find(project).toArray(function(err, data){
      if (err) return trigger(err);
      
      fn(err, data.concat());
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
    });
  });
}

/**
 * Insert project into GPC_DB.projects
 *
 * @param {JSON} project data object
 * @param {Function} callback function(err, records){}
 *
 * @api public
 */
ProjectDataManager.add = function(project, fn){
  var cEvent = 'project.data.add.error';
  var cListener = function(err){
    console.error(err.stack);
    fn(err);
    emitter.removeListener(cEvent, cListener);
    dataMgr.closeDbServer();
  }
  emitter.addListener(cEvent, cListener);
  var trigger = function(err){
    emitter.emit(cEvent, err);
  }

  dataMgr.connectDbServer(ProjectDataManager.key, trigger, function(collection){
    collection.find({id: project.id}).toArray(function(err, data){
      if (err) return trigger(err);
      else if(data.concat().length>0)
        return trigger(new DataExistError());
      else{
        collection.insert(project, {safe: true}, function(error, records){
          if (error) return trigger(error);
          
          fn(error, records);
          emitter.removeListener(cEvent, cListener);
          dataMgr.closeDbServer();
        });
      }
    });
  });
}

ProjectDataManager.update = function(project, data, fn){
  var cEvent = 'project.data.update.error';
  var cListener = function(err){
    console.error(err.stack);
    fn(err);
    emitter.removeListener(cEvent, cListener);
    dataMgr.closeDbServer();
  }
  emitter.addListener(cEvent, cListener);
  var trigger = function(err){
    emitter.emit(cEvent, err);
  }

  dataMgr.connectDbServer(ProjectDataManager.key, trigger, function(collection){
    collection.update(project, {$set: data}, {multi: true}, function(err){
      if (err) return trigger(err);
      
      fn(err);
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
    });
  });
}

/**
 * Remove project from GPC_DB.projects
 *
 * @param {JSON} project data object
 * @param {Function} callback function(err){}
 *
 * @api public
 */
ProjectDataManager.remove = function(project, fn){
  var cEvent = 'project.data.remove.error';
  var cListener = function(err){
    console.error(err.stack);
    fn(err);
    emitter.removeListener(cEvent, cListener);
    dataMgr.closeDbServer();
  }
  emitter.addListener(cEvent, cListener);
  var trigger = function(err){
    emitter.emit(cEvent, err);
  }

  dataMgr.connectDbServer(ProjectDataManager.key, trigger, function(collection){
    collection.remove(project, false, function(err){
      if (err) return trigger(err);

      fn(err);
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
    });
  });
}

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
ProjectDataManager.insertCandidate = function(project, candidateId, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(ProjectDataManager.key, function(err, collection){
      collection.update(project, {$addToSet: {candidates: candidateId}}, {upsert: true}, function(err){
        fn(err);
      });
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
ProjectDataManager.removeCandidate = function(project, candidateId, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(ProjectDataManager.key, function(err, collection){
      collection.update(project, {$pull: {candidates: candidateId}}, {upsert: true}, function(err){
        fn(err);
      });
    });
  });
}