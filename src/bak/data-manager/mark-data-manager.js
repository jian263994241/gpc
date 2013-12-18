/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

var DataMgr   = require('./');
var ObjectID  = require('mongodb').ObjectID;
var events    = require('events');
var emitter   = new events.EventEmitter();
var util      = require('util');

var MarkDataManager = module.exports = function(config){
  DataMgr.call(this, config);
  this.key = this.COLLECTION_MARK;
}
util.inherits(MarkDataManager, DataMgr);

/**
 * Query specified mark from GPC_DB.marks
 *
 * @param {JSON} mark data object
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
MarkDataManager.prototype.query = function(mark, fn) {
  var cEvent = 'mark.data.query.error';
  DataMgr.prototype.query.call(this, cEvent, mark, fn);
};

/**
 * Insert mark into GPC_DB.marks
 *
 * @param {JSON} mark data object
 * @param {Function} callback function(err, records){}
 *
 * @api public
 */
MarkDataManager.prototype.add = function(mark, fn){
  var that = this;
  var cEvent = 'mark.data.add.error';
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

  this.connectDbServer(this.COLLECTION_MARK, trigger, function(collection){
    var saveCallback = function(err){
      if (err) return trigger(err);
      
      fn(err);
      emitter.removeListener(cEvent, cListener);
      that.closeDbServer();
    }

    var insertCallback = function(err){
      if (err) return trigger(err);
      
      fn(err);
      emitter.removeListener(cEvent, cListener);
      that.closeDbServer();
    }

    collection.find({candidate: mark.candidate, project: mark.project}).toArray(function(err, data){
      if (err) return trigger(err);
      else if(data.concat().length>0){
        mark._id = data[0]._id;
        collection.save(mark, {safe: true}, saveCallback);
      }else{
        collection.insert(mark, {safe: true}, insertCallback);
      }
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
MarkDataManager.prototype.remove = function(mark, fn) {
  var cEvent = 'mark.data.remove.error';
  DataMgr.prototype.remove.call(this, cEvent, mark, fn);
};