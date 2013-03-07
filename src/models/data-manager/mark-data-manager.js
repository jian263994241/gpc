/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

var dataMgr   = require('./data-manager');
var ObjectID  = require('mongodb').ObjectID;
var events    = require('events');
var emitter   = new events.EventEmitter();

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
  var cEvent = 'mark.data.query.error';
  var cListener = function(err){
    emitter.removeListener(cEvent, cListener);
    console.error(err.stack);
    fn(err);
    dataMgr.closeDbServer();
  }
  emitter.addListener(cEvent, cListener);
  var trigger = function(err){
    emitter.emit(cEvent, err);
  }

  dataMgr.connectDbServer(MarkDataManager.key, trigger, function(collection){
    collection.find(mark).toArray(function(err, data){
      if (err) return trigger(err);
      
      fn(err, data.concat());
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
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
  var cEvent = 'mark.data.add.error';
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

  dataMgr.connectDbServer(MarkDataManager.key, trigger, function(collection){
    var saveCallback = function(err){
      if (err) return trigger(err);
      
      fn(err);
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
    }

    var insertCallback = function(err){
      if (err) return trigger(err);
      
      fn(err);
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
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
MarkDataManager.remove = function(mark, fn){
  var cEvent = 'mark.data.remove.error';
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

  dataMgr.connectDbServer(MarkDataManager.key, trigger, function(collection){
    collection.remove(mark, false, function(err){
      if (err) return trigger(err);

      fn(err);
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
    });
  });
}