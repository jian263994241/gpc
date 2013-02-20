/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

var dataMgr         = require('./data-manager');
var DataExistError  = require('../error/data-exist-error');

var CandidateDataManager = exports = module.exports = {};
CandidateDataManager.key = dataMgr.COLLECTION_CANDIDATE;

/**
 * Query specified candidates from GPC_DB.candidates
 *
 * @param {JSON} candidate data object
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
CandidateDataManager.query = function(candidate, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(CandidateDataManager.key, function(err, collection){
      collection.find(candidate).toArray(function(err, data){
        if(!err)fn(err, data.concat());
        else fn(err);
        mongoServer.close();
      });
    });
  });
}

/**
 * Insert candidate into GPC_DB.candidates
 *
 * @param {JSON} candidate data object
 * @param {Function} callback function(err, records){}
 *
 * @api public
 */
CandidateDataManager.add = function(candidate, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(CandidateDataManager.key, function(err, collection){
      collection.find({source: candidate.source}).toArray(function(err, data){
        if (err) {
          fn(err);
          mongoServer.close();
        }else if(data.length > 0){
          fn(new DataExistError());
          mongoServer.close();
        }else{
          collection.insert(candidate, {safe: true}, function(err, records){
            fn(err, records);
            mongoServer.close();
          });
        }
      });
    });
  });
}

/**
 * Remove candidate from GPC_DB.candidates
 *
 * @param {JSON} candidate data object
 * @param {Function} callback function(err){}
 *
 * @api public
 */
CandidateDataManager.remove = function(candidate, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(CandidateDataManager.key, function(err, collection){
      collection.remove(candidate, false, function(err){
        fn(err);
        mongoServer.close();
      });
    });
  });
}