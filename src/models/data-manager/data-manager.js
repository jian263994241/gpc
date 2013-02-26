/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
const DB_SERVER_HOST = '127.0.0.1';
const DB_SERVER_PORT = 27017;
const DB_NAME        = 'GPC_DB';
const ERROR_SIGN     = 'error';

var mongodb = require('mongodb');
var events  = require('events');
var emitter = new events.EventEmitter();

var DataManager = exports = module.exports = {};

DataManager.COLLECTION_USER      = COLLECTION_USER      = 'users';
DataManager.COLLECTION_CANDIDATE = COLLECTION_CANDIDATE = 'candidates';
DataManager.COLLECTION_PROJECT   = COLLECTION_PROJECT   = 'projects';
DataManager.COLLECTION_MARK      = COLLECTION_MARK      = 'marks';
DataManager.ERROR_SIGN                                  = ERROR_SIGN;

var dbCollections = [COLLECTION_USER, COLLECTION_CANDIDATE, COLLECTION_PROJECT, COLLECTION_MARK];

/**
 * Create MongoDB client object
 *
 * @api public
 */
DataManager.createDbServer = function(){
  return mongoServer = new mongodb.Server(DB_SERVER_HOST, DB_SERVER_PORT, {});
}

/**
 * Close MongoDB client object
 *
 * @param {MongoDBServer}
 *
 * @api public
 */
DataManager.closeDbServer = function(mongoServer){
  if (mongoServer) mongoServer.close();
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

/**
 * Connect MongoDB Server
 *
 * @param {Function} callback function(err, data);
 *
 * @api public
 */
DataManager.connectDbServer = function(key, trigger, fn){
  var mongoServer = DataManager.createDbServer();
  var dbConnector = DataManager.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    if(err || !db) return trigger(err);
    else return DataManager.fetchCollection(db, key, trigger, fn);
  });
}

/**
 * Fetch collection from database
 *
 * @param {MongoDB.db}
 * @param {Function} callback function(err, data);
 *
 * @api public
 */
DataManager.fetchCollection = function(db, key, trigger, fn){
  db.collection(key, function(err, collection){
    if (err) return trigger(err);
    else return fn(collection);
  });
}