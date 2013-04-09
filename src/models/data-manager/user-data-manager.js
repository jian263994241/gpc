/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
var DataMgr         = require('./data-manager');
var UserExistError  = require('../error/user-exist-error');
var events          = require('events');
var emitter         = new events.EventEmitter();
var util            = require('util');

var UserDataManager = module.exports = function(config){
  DataMgr.call(this, config);
  this.key = this.COLLECTION_USER;
}
util.inherits(UserDataManager, DataMgr);

/**
 * Query specified user from GPC_DB.users
 *
 * @param {JSON} user data object
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
UserDataManager.prototype.query = function(user, fn) {
  var cEvent = 'user.data.query.error';
  DataMgr.prototype.query.call(this, cEvent, user, fn);
};

/**
 * Insert user into GPC_DB.users
 *
 * @param {JSON} user data object
 * @param {Function} callback function(err, records){}
 *
 * @api public
 */
UserDataManager.prototype.add = function(user, fn){
  var that = this;
  var cEvent = 'user.data.add.error';
  var cListener = function(err){
    console.error(err.stack);
    fn(err);
    emitter.removeListener(cEvent, cListener);
    that.closeDbServer();
  }
  emitter.addListener(cEvent, cListener);
  var trigger = function(err){
    emitter.emit(cEvent, err);
  }

  this.connectDbServer(this.COLLECTION_USER, trigger, function(collection){
    collection.find({username: user.username}).toArray(function(err, data){
      if (err) trigger(err);
      else if(data.concat().length>0)
        return trigger(new UserExistError());
      else{
        user.candidates = new Array();
        var insertCallback = function(err, records){
          if (err) return trigger(err);

          fn(err, records);
          emitter.removeListener(cEvent, cListener);
          that.closeDbServer();
          return;
        }
        collection.insert(user, {safe: true}, insertCallback);
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
UserDataManager.prototype.update = function(user, data, fn) {
  var cEvent = 'user.data.update.error';
  DataMgr.prototype.update.call(this, cEvent, user, data, fn);
};

/**
 * Remove user from GPC_DB.users
 *
 * @param {JSON} user data object
 * @param {Function} callback function(err){}
 *
 * @api public
 */
UserDataManager.prototype.remove = function(user, fn) {
  var cEvent = 'user.data.remove.error';
  DataMgr.prototype.remove.call(this, cEvent, user, fn);
};