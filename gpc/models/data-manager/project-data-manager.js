/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

var dataMgr = require('./data-manager');

var ProjectDataManager = exports = module.exports = {};
ProjectDataManager.key = dataMgr.COLLECTION_PROJECT;

/**
 * Render project data management view
 *
 * @param {Response}
 *
 * @api public
 */
ProjectDataManager.render = function(res){
  return res.render('projects', {
    project_status: 'active',
    candidate_status: '',
    user_status:'',
    modal_id: 'project-modal',
    modal_status: '',
    modal_type: 'New Project',
  });
}

/**
 * Query specified projects from GPC_DB.projects
 *
 * @param {JSON} project data object
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
ProjectDataManager.query = function(project, fn){
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
 * Insert project into GPC_DB.projects
 *
 * @param {JSON} project data object
 * @param {Function} callback function(err, records){}
 *
 * @api public
 */
ProjectDataManager.add = function(project, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(ProjectDataManager.key, function(err, collection){
      collection.find(project).toArray(function(err, data){
        if (err) {
          fn(err);
          mongoServer.close();
        }else if(data.length > 0){
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
 * @param {JSON} project data object
 * @param {Function} callback function(err){}
 *
 * @api public
 */
ProjectDataManager.remove = function(project, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(ProjectDataManager.key, function(err, collection){
      collection.remove(project, false, function(err){
        fn(err);
        mongoServer.close();
      });
    });
  });
}

/**
 * Render project detailed data management view
 *
 * @param {Response}
 *
 * @api public
 */
ProjectDataManager.renderDetailView = function(records, res){
  return res.render('project-candidates', {
    project_status: '',
    candidate_status: '',
    user_status:'',
    modal_id: 'select-candidate-modal',
    modal_status: '',
    modal_type: 'Add Candidate',
    project_id: records[0].id,
    project_title: records[0].name,
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
      collection.update({id: project.id}, {$addToSet: {candidates: candidateId}}, {upsert: true}, function(err){
        fn(err);
      });
    });
  });
}

/**
 * Remove candidateId from specified project in GPC_DB.projects
 *
 * @param {JSON} project data object {id}
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
      collection.update({id: project.id}, {$pull: {candidates: candidateId}}, {upsert: true}, function(err){
        fn(err);
      });
    });
  });
}