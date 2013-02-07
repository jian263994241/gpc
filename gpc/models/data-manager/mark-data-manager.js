/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

var dataMgr = require('./data-manager');

var MarkDataManager = exports = module.exports = {};
MarkDataManager.key = dataMgr.COLLECTION_MARK;

/**
 * Query specified mark from GPC_DB.marks
 *
 * @param {JSON} mark data object
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
MarkDataManager.query = function(mark, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(MarkDataManager.key, function(err, collection){
      collection.find({candidate: mark.candidate, project: mark.project}).toArray(function(err, data){
        if(!err)fn(err, data.concat());
        else fn(err);
        mongoServer.close();
      });
    });
  });
}

/**
 * Insert mark into GPC_DB.marks
 *
 * @param {JSON} mark data object
 * @param {Function} callback function(err, records){}
 *
 * @api public
 */
MarkDataManager.add = function(mark, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(MarkDataManager.key, function(err, collection){
      collection.find({candidate: mark.candidate, project: mark.project}).toArray(function(err, data){
        if (err) {
          fn(err);
          mongoServer.close();
        }else if(data.length > 0){
          mark._id = data[0]._id;
          collection.save(mark, {safe: true}, function(err){
            fn(err);
            mongoServer.close();
          });
          mongoServer.close();
        }else{
          collection.insert(mark, {safe: true}, function(err){
            fn(err);
            mongoServer.close();
          });
        }
      });
    });
  });
}

/**
 * Remove mark from GPC_DB.marks
 *
 * @param {JSON} mark data object
 * @param {Function} callback function(err){}
 *
 * @api public
 */
MarkDataManager.remove = function(mark, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(MarkDataManager.key, function(err, collection){
      collection.remove({candidate: mark.candidate, project: mark.project}, false, function(err){
        fn(err);
        mongoServer.close();
      });
    });
  });
}