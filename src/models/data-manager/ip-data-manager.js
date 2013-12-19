/*
 @author ukey
 */

var DataMgr   = require('./data-manager');
var ObjectID  = require('mongodb').ObjectID;
var events    = require('events');
var emitter   = new events.EventEmitter();
var util      = require('util');

var IpDataManager = module.exports = function(config){
    DataMgr.call(this, config);
    this.key = this.COLLECTION_IP;
}
util.inherits(IpDataManager, DataMgr);


/**
 * Query specified mark from GPC_DB.mac
 *
 * @param {JSON} mark data object
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
IpDataManager.prototype.query = function(ip, fn) {
    var cEvent = 'mac.data.query.error';
    DataMgr.prototype.query.call(this, cEvent, ip, fn);
};

/**
 * Insert mark into GPC_DB.mac
 *
 * @param {JSON} mark data object
 * @param {Function} callback function(err, records){}
 *
 * @api public
 */
IpDataManager.prototype.add = function(ip, fn){
    var that = this;
    var cEvent = 'user.ip.data.add.error';
    var cListener = function(err){
        console.error(err.stack);
        fn(err);
        emitter.removeListener(cEvent, cListener);
        that.closeDbServer(db);
    }
    emitter.once(cEvent, cListener);
    var trigger = function(err){
        emitter.emit(cEvent, err);
    }

    this.connectDbServer(this.COLLECTION_IP, trigger, function(collection,db){
        var saveCallback = function(err){
            if (err) return trigger(err);
            fn(err);
            emitter.removeListener(cEvent, cListener);
            that.closeDbServer(db);
        }

        var insertCallback = function(err){
            if (err) return trigger(err);
            fn(err);
            emitter.removeListener(cEvent, cListener);
            that.closeDbServer(db);
        }

        collection.find({username: ip.username}).toArray(function(err, data){
            if (err) return trigger(err);
            else if(data.concat().length>0){
                ip._id = data[0]._id;
                collection.save(ip, {safe: true}, saveCallback);
            }else{
                collection.insert(ip, {safe: true}, insertCallback);
            }
        });
    });
}

/**
 * Remove mark from GPC_DB.mac
 *
 * @param {JSON} mark data object
 * @param {Function} callback function(err){}
 *
 * @api public
 */
IpDataManager.prototype.remove = function(ip, fn) {
    var cEvent = 'mac.data.remove.error';
    DataMgr.prototype.remove.call(this, cEvent, ip, fn);
};