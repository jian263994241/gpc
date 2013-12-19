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
  DataMgr.call(this, config);
  this.key = this.COLLECTION_CANDIDATE;
}
util.inherits(CandidateDataManager, DataMgr);

/**
 * Query specified candidates from GPC_DB.candidates
 *
 * @param {JSON} candidate data object
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
CandidateDataManager.prototype.query = function(candidate, fn) {
  var cEvent = 'candidate.data.query.error';
  DataMgr.prototype.query.call(this, cEvent, candidate, fn);
};

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
    emitter.removeListener(cEvent, cListener);
  }
  emitter.once(cEvent, cListener);
  var trigger = function(err){
    emitter.emit(cEvent, err);
  }

  this.connectDbServer(this.COLLECTION_CANDIDATE, trigger, function(collection,db){
    collection.find({source: candidate.source}).toArray(function(err, data){
      if (err) trigger(err);
      if(data.length>0){
          var err0 = new DataExistError();
          trigger(err0)
          fn&&fn(err0);
      }
      else{
        var insertCallback = function(err, records){
          if (err) trigger(err);
            fn&&fn(err, records);
          emitter.removeListener(cEvent, cListener);
          that.closeDbServer(db);
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
CandidateDataManager.prototype.update = function(candidate, data, fn) {
  var cEvent = 'candidate.data.update.error';
  DataMgr.prototype.update.call(this, cEvent, candidate, data, fn);
};

/**
 * Remove candidate from GPC_DB.candidates
 *
 * @param {JSON} candidate data object
 * @param {Function} callback function(err){}
 *
 * @api public
 */
CandidateDataManager.prototype.remove = function(candidate, fn) {
  var cEvent = 'candidate.data.remove.error';
  DataMgr.prototype.remove.call(this, cEvent, candidate, fn);
};