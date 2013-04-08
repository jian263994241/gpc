/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

var DataMgr         = require('./data-manager');
var DataExistError  = require('../error/data-exist-error');
var events          = require('events');
var emitter         = new events.EventEmitter();
var util            = require('util');

var CandidateDataManager = module.exports = function(config){
  this.call(this, config);
}
util.inherts(CandidateDataManager, DataMgr);

/**
 * Query specified candidates from GPC_DB.candidates
 *
 * @param {JSON} candidate data object
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
// CandidateDataManager.prototype.query = function(candidate, fn){
//   var that = this;
//   var cEvent = 'candidate.data.query.error';
//   var cListener = function(err){
//     emitter.removeListener(cEvent, cListener);
//     console.error(err.stack);
//     fn(err);
//     that.closeDbServer();
//   }
//   emitter.addListener(cEvent, cListener);
//   var trigger = function(err){
//     emitter.emit(cEvent, err);
//   }

//   this.connectDbServer(this.COLLECTION_CANDIDATE, trigger, function(collection){
//     collection.find(candidate).toArray(function(err, data){
//       if (err) trigger(err);
      
//       fn(err, data.concat());
//       emitter.removeListener(cEvent, cListener);
//       that.closeDbServer();
//     });
//   });
// }

/**
 * Insert candidate into GPC_DB.candidates
 *
 * @param {JSON} candidate data object
 * @param {Function} callback function(err, records){}
 *
 * @api public
 */
CandidateDataManager.prototype.add = function(candidate, fn){
  var that = this;
  var cEvent = 'candidate.data.add.error';
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

  this.connectDbServer(this.COLLECTION_CANDIDATE, trigger, function(collection){
    collection.find({source: candidate.source}).toArray(function(err, data){
      if (err) return trigger(err);
      else if(data.concat().length>0)
        return trigger(new DataExistError());
      else{
        var insertCallback = function(err, records){
          if (err) return trigger(err);
          
          fn(err, records);
          emitter.removeListener(cEvent, cListener);
          that.closeDbServer();
        }
        collection.insert(candidate, {safe: true}, insertCallback);
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
// CandidateDataManager.prototype.update = function(candidate, data, fn){
//   var that = this;
//   var cEvent = 'candidate.data.update.error';
//   var cListener = function(err){
//     console.error(err.stack);
//     fn(err);
//     emitter.removeListener(cEvent, cListener);
//     that.closeDbServer();
//   }
//   emitter.addListener(cEvent, cListener);
//   var trigger = function(err){
//     emitter.emit(cEvent, err);
//   }
//   this.connectDbServer(this.COLLECTION_CANDIDATE, trigger, function(collection){
//     collection.update(candidate, {$set: data}, {multi: true}, function(err){
//       if (err) return trigger(err);
      
//       fn(err);
//       emitter.removeListener(cEvent, cListener);
//       that.closeDbServer();
//     });
//   });
// }

/**
 * Remove candidate from GPC_DB.candidates
 *
 * @param {JSON} candidate data object
 * @param {Function} callback function(err){}
 *
 * @api public
 */
// CandidateDataManager.prototype.remove = function(candidate, fn){
//   var that = this;
//   var cEvent = 'candidate.data.remove.error';
//   var cListener = function(err){
//     console.error(err.stack);
//     fn(err);
//     emitter.removeListener(cEvent, cListener);
//     that.closeDbServer();
//   }
//   emitter.addListener(cEvent, cListener);
//   var trigger = function(err){
//     emitter.emit(cEvent, err);
//   }

//   this.connectDbServer(this.COLLECTION_CANDIDATE, trigger, function(collection){
//     collection.remove(candidate, false, function(err){
//       if (err) return trigger(err);

//       fn(err);
//       emitter.removeListener(cEvent, cListener);
//       that.closeDbServer();
//     });
//   });
// }