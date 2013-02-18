/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

const DB_SERVER_HOST = '127.0.0.1';
const DB_SERVER_PORT = 27017;
const DB_NAME = 'GPC_DB';

var mongodb = require('mongodb');

var DataManager = exports = module.exports = {};

DataManager.COLLECTION_USER      = COLLECTION_USER      = 'users';
DataManager.COLLECTION_CANDIDATE = COLLECTION_CANDIDATE = 'candidates';
DataManager.COLLECTION_PROJECT   = COLLECTION_PROJECT   = 'projects';
DataManager.COLLECTION_MARK      = COLLECTION_MARK      = 'marks';

var dbCollections = [COLLECTION_USER, COLLECTION_CANDIDATE, COLLECTION_PROJECT, COLLECTION_MARK];

/**
 * Open Database and create collections
 *
 * @api public
 */
DataManager.initDatabase = function(){
  var mongoServer = new mongodb.Server(DB_SERVER_HOST, DB_SERVER_PORT, {});
  var dbConnector = new mongodb.Db(DB_NAME, mongoServer, {w: 1});

  dbConnector.open(function(err, db){
    db.createCollection(dbCollections, function(err, collections){
      if (!err && collections) {
        mongoServer.close();
        console.log('Init database service success');
      }else{
        throw new Error('Init database service failed');
      }
    });
  });
}

/**
 * Create MongoDB client object
 *
 * @api public
 */
DataManager.createDbServer = function(){
  return mongoServer = new mongodb.Server(DB_SERVER_HOST, DB_SERVER_PORT, {});
}

/**
 * Create MongoDB client object
 *
 * @param {mongodb.Server}
 *
 * @api public
 */
DataManager.createDbConnector = function(mongoServer){
  return new mongodb.Db(DB_NAME, mongoServer, {w: 1});
}