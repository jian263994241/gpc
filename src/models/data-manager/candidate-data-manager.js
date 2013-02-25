/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

var dataMgr         = require('./data-manager');
var DataExistError  = require('../error/data-exist-error');
var events          = require('events');
var emitter         = new events.EventEmitter();

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
  var cEvent = 'candidate.data.query.error';
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

  dataMgr.connectDbServer(CandidateDataManager.key, trigger, function(collection){
    collection.find(candidate).toArray(function(err, data){
      if (err) trigger(err);
      
      fn(err, data.concat());
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
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
  var cEvent = 'candidate.data.add.error';
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

  dataMgr.connectDbServer(CandidateDataManager.key, trigger, function(collection){
    collection.find({source: candidate.source}).toArray(function(err, data){
      if (err) return trigger(err);
      else if(data.concat().length>0)
        return trigger(new DataExistError());
      else{
        collection.insert(candidate, {safe: true}, function(error, records){
          if (error) return trigger(error);
          
          fn(error, records);
          emitter.removeListener(cEvent, cListener);
          dataMgr.closeDbServer();
        });
      }
    });
  });
}

/**
 * Update candidate in GPC_DB.candidates
 *
 * @param {JSON} candidate data object
 * @param {JSON} update data
 * @param {Function} callback function(err){}
 *
 * @api public
 */
CandidateDataManager.update = function(candidate, data, fn){
  var cEvent = 'candidate.data.update.error';
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
  dataMgr.connectDbServer(CandidateDataManager.key, trigger, function(collection){
    collection.update(candidate, {$set: data}, {multi: true}, function(err){
      if (err) return trigger(err);
      
      fn(err);
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
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
  var cEvent = 'candidate.data.remove.error';
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

  dataMgr.connectDbServer(CandidateDataManager.key, trigger, function(collection){
    collection.remove(candidate, false, function(err){
      if (err) return trigger(err);

      fn(err);
      emitter.removeListener(cEvent, cListener);
      dataMgr.closeDbServer();
    });
  });
}