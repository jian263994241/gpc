/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
var dataMgr         = require('./data-manager');
var DataExistError  = require('../error/data-exist-error');
var events          = require('events');
var emitter         = new events.EventEmitter();

var UserDataManager = exports = module.exports = {};
UserDataManager.key = dataMgr.COLLECTION_USER;

/**
 * Query specified user from GPC_DB.users
 *
 * @param {JSON} user data object
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
UserDataManager.query = function(user, fn){
  var cEvent = 'user.data.query.error';
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

  dataMgr.connectDbServer(UserDataManager.key, trigger, function(collection){
    collection.find(user).toArray(function(err, data){
      if (err) return trigger(err);
      
      fn(err, data.concat());
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
    });
  });
}

/**
 * Insert user into GPC_DB.users
 *
 * @param {JSON} user data object
 * @param {Function} callback function(err, records){}
 *
 * @api public
 */
UserDataManager.add = function(user, fn){
  var cEvent = 'user.data.add.error';
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

  dataMgr.connectDbServer(UserDataManager.key, trigger, function(collection){
    collection.find({username: user.username}).toArray(function(err, data){
      if (err) trigger(err);
      else if(data.concat().length>0)
        return trigger(new DataExistError());
      else{
        user.candidates = new Array();
        collection.insert(user, {safe: true}, function(error, records){
          if (error) return trigger(error);

          fn(error, records);
          emitter.removeListener(cEvent, cListener);
          dataMgr.closeDbServer();
          return;
        });
      }
    });
  });
}

/**
 * Update user in GPC_DB.users
 *
 * @param {JSON} user data object
 * @param {JSON} update data
 * @param {Function} callback function(err){}
 *
 * @api public
 */
UserDataManager.update = function(user, data, fn){
  var cEvent = 'user.data.update.error';
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

  dataMgr.connectDbServer(UserDataManager.key, trigger, function(collection){
    collection.update(user, {$set: data}, {multi: true}, function(err){
      if (err) trigger(err);
      
      fn(err);
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
      return;
    });
  });
}

/**
 * Remove user from GPC_DB.users
 *
 * @param {JSON} user data object
 * @param {Function} callback function(err){}
 *
 * @api public
 */
UserDataManager.remove = function(user, fn){
  var cEvent = 'user.data.remove.error';
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

  dataMgr.connectDbServer(UserDataManager.key, trigger, function(collection){
    collection.remove(user, false, function(err){
      if (err) trigger(err);

      fn(err);
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
      return;
    });
  });
}