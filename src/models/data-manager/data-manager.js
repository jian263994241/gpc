/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
var path    = require("path");
var fs      = require('fs');
var mongodb = require('mongodb');
var events  = require('events');
var emitter = new events.EventEmitter();
emitter.setMaxListeners(0);
function readFile(fn) {
  var filename = path.resolve(__dirname, '../../conf.json');
  path.exists(filename, function(exists){
    if (exists) fs.readFile(filename, "binary", fn);
    else fn(new Error());
  });
}

var DataManager = module.exports = function(){
  this.COLLECTION_USER      = 'users';
  this.COLLECTION_CANDIDATE = 'candidates';
  this.COLLECTION_PROJECT   = 'projects';
  this.COLLECTION_MARK      = 'marks';
  this.COLLECTION_IP       = 'user_ip';
  this.key = null;

  var that = this;
  readFile(function(err, file){
    if (!err && file) {
      var conf = JSON.parse(file);
      that.ERROR_SIGN           = conf.error_mark;
      that.DB_NAME              = conf.db_name;
      that.DB_SERVER_HOST       = conf.db_server_host;
      that.DB_SERVER_PORT       = conf.db_server_port;
      that.IP_LOCK             = conf.ip_lock;
    }else{
      console.error(err.stack);
    }
  });
}

/**
 * Create MongoDB client object
 *
 * @api public
 */
DataManager.prototype.createDbServer = function() {
  return new mongodb.Server(this.DB_SERVER_HOST, this.DB_SERVER_PORT, {});
};

/**
 * Close MongoDB client object
 *
 * @param {MongoDBServer}
 *
 * @api public
 */
DataManager.prototype.closeDbServer = function(mongoServer) {
  if (mongoServer) mongoServer.close();
};

/**
 * Create MongoDB client object
 *
 * @param {mongodb.Server}
 *
 * @api public
 */
DataManager.prototype.createDbConnector = function(mongoServer) {
  return new mongodb.Db(this.DB_NAME, mongoServer, {w: 1});
};

/**
 * Connect MongoDB Server
 *
 * @param {Function} callback function(err, data);
 *
 * @api public
 */
DataManager.prototype.connectDbServer = function(key, trigger, fn){
  var mongoServer = this.createDbServer();
  var dbConnector = this.createDbConnector(mongoServer);

  var that = this;
  dbConnector.open(function(err, db){
    if(err || !db) return trigger(err);
    else return that.fetchCollection(db, key, trigger, fn);
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
DataManager.prototype.fetchCollection = function(db, key, trigger, fn){
  db.collection(key, function(err, collection){
    if (err) return trigger(err);
    else return fn(collection);
  });
}

DataManager.prototype.exportFile = function(path, fn) {
  var mongoServer = this.createDbServer();
  var dbConnector = this.createDbConnector(mongoServer);

  var that = this;
  dbConnector.open(function(err, db){
    if(err || !db) return trigger(err);
    else {
      var gs = new mongodb.GridStore(db, 'data.txt', 'w', {'metadata': 'text/plain'});
      gs.open(function(err, store){
        gs.writeFile(path+'data.txt', function(err, doc){
          if (!err) console.log('write file success');
          else console.error('write file error');
        });
      })
    };
  });
};

DataManager.prototype.query = function(custom_event, params, fn) {
  var that = this;
  var cListener = function(err){
    console.error(err.stack);
    fn(err);
    emitter.removeListener(custom_event, cListener);
    that.closeDbServer();
  }
  emitter.once(custom_event, cListener);
  var trigger = function(err){
    emitter.emit(custom_event, err);
  }

  if (!this.key) return trigger(new Error());
  this.connectDbServer(this.key, trigger, function(collection){
    collection.find(params).toArray(function(err, data){
      if (err) return trigger(err);
      
      fn(err, data.concat());
      emitter.removeListener(custom_event, cListener);
      that.closeDbServer();
    });
  });
};

DataManager.prototype.add = function(data, fn) {
  // overload by other sub class
};

DataManager.prototype.update = function(custom_event, old_data, new_data, fn) {
  var that = this;
  var cListener = function(err){
    console.error(err.stack);
    fn(err);
    emitter.removeListener(custom_event, cListener);
    that.closeDbServer();
  }
  emitter.once(custom_event, cListener);
  var trigger = function(err){
    emitter.emit(custom_event, err);
  }

  if (!this.key) return trigger(new Error());
  this.connectDbServer(this.key, trigger, function(collection){
    collection.update(old_data, {$set: new_data}, {multi: true}, function(err){
      if (err) trigger(err);
      
      fn(err);
      emitter.removeListener(custom_event, cListener);
      that.closeDbServer();
      return;
    });
  });
};

DataManager.prototype.remove = function(custom_event, params, fn) {
  var that = this;
  var cListener = function(err){
    console.error(err.stack);
    fn(err);
    emitter.removeListener(custom_event, cListener);
    that.closeDbServer();
  }
  emitter.once(custom_event, cListener);
  var trigger = function(err){
    emitter.emit(custom_event, err);
  }

  if (!this.key) return trigger(new Error());

  this.connectDbServer(this.key, trigger, function(collection){

    collection.remove(params, false, function(err){
      if (err) trigger(err);
      fn&&fn(err);
      emitter.removeListener(custom_event, cListener);
      that.closeDbServer();
      return;
    });
  });
};