/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

var dataMgr = require('./data-manager');
var _ = require('underscore');

var ProjectDataManager = exports = module.exports = {};
ProjectDataManager.key = dataMgr.COLLECTION_PROJECT;

/**
 * Query specified projects from GPC_DB.projects
 *
 * @param{JSON} project data object
 * @param{Function} callback function(err, data){}
 *
 * @api public
 */
ProjectDataManager.queryProject = function(project, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(ProjectDataManager.key, function(err, collection){
      collection.find(project).toArray(function(err, data){
        fn(err, data.concat());
        mongoServer.close();
      });
    });
  });
}

/**
 * Query all projects from GPC_DB.projects
 *
 * @param{Function} callback function(err, data){}
 *
 * @api public
 */
ProjectDataManager.queryAllProjects = function(fn) {
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(ProjectDataManager.key, function(err, collection){
      collection.find().toArray(function(err, data){
        fn(err, data.concat());
        mongoServer.close();
      });
    });
  });
}

/**
 * Insert project into GPC_DB.projects
 *
 * @param{JSON} project data object
 * @param{Function} callback function(err, records){}
 *
 * @api public
 */
ProjectDataManager.addProject = function(project, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(ProjectDataManager.key, function(err, collection){
      collection.find(project).toArray(function(err, data){
        if (err) {
          fn(err);
          mongoServer.close();
        }else if(data){
          fn(new Error('Data Exist'));
          mongoServer.close();
        }else{
          collection.insert(project, {safe: true}, function(err, records){
            fn(err, records);
            mongoServer.close();
          });
        }
      });
    });
  });
}

/**
 * Remove project from GPC_DB.projects
 *
 * @param{JSON} project data object
 * @param{Function} callback function(err){}
 *
 * @api public
 */
ProjectDataManager.removeProject = function(project, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(ProjectDataManager.key, function(err, collection){
      collection.remove(project, false, function(err){
        fn(err);
      });
    });
  });
}

/**
 * Insert candidateId into specified project in GPC_DB.projects
 *
 * @param{JSON} project data object
 * @paran{String} candidateId
 * @param{Function} callback function(err){}
 *
 * @api public
 * @see http://docs.mongodb.org/manual/applications/update/
 */
ProjectDataManager.insertCandidate = function(project, candidateId, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(ProjectDataManager.key, function(err, collection){
      collection.update({_id: project._id, candidates: candidateId}, {$push: {candidates: candidateId}}, {upsert: true}, function(err){
        fn(err);
      });
    });
  });
}