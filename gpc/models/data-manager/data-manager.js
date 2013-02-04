const DB_SERVER_HOST = '127.0.0.1';
const DB_SERVER_PORT = 27017;
const DB_NAME = 'GPC_DB';

var mongodb = require('mongodb');

var DataManager = exports = module.exports = {};

DataManager.COLLETION_USER      = COLLETION_USER      = 'users';
DataManager.COLLETION_CANDIDATE = COLLETION_CANDIDATE = 'candidates';
DataManager.COLLETION_PROJECT   = COLLETION_PROJECT   = 'projects';
DataManager.COLLETION_MARK      = COLLETION_MARK      = 'marks';

var dbCollections = [COLLETION_USER, COLLETION_CANDIDATE, COLLETION_PROJECT, COLLETION_MARK];

/**
 * Open Database and create collections
 *
 * @api public
 *
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
 * Get collection from database by key
 *
 * @param{String} collection name
 * @param{Function} callback function(collection, close){}
 * 
 * @api public
 *
 */
DataManager.openCollection = function(key, fn) {
  var mongoServer = new mongodb.Server(DB_SERVER_HOST, DB_SERVER_PORT, {});
  var dbConnector = new mongodb.Db(DB_NAME, mongoServer, {w: 1});

  var close = function(){
    mongoServer.close();
  }

  dbConnector.open(function(err, db){
    db.collection(key, function(err, collection){
      fn(collection, close);
    })
  });
}