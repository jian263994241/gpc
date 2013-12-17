/**
 * @author ukey
 * @version Beta 1.1
 *
 * require('getmac').getMac(function(err,macAddress){
    if (err)  throw err;
    console.log(macAddress);
});
 */

// Declare required lib
var _           = require('underscore');
var IpDataMgr = require('./data-manager/ip-data-manager');
var AuthError   = require('./error/thread-lock-error');

// Init
var ipDataMgr = new IpDataMgr();

function Ip(){
    this.clientIp ="";
    this.username = "" ;
    this.address = '';

}

/**
 * @api public
 */
Ip.prototype.make = function(username,clientIp,fn) {
    if(!ipDataMgr.IP_LOCK) return fn();
    
    this.username = username;
    this.clientIp = clientIp;
    var _this = this;
    var macErr = 'IP address is locked';
    var queryCallback = function(err,data){
        if(err) return fn(err);
        if(data.length==0){
            _this.save(function(err){
                if(!err) fn(null);
            })
        }else{
            _this.address = data[0].address;
            console.log(_this.clientIp,_this.address);
            if(_this.clientIp!=_this.address){
                fn(macErr);
            }else{
                fn(null);
            }
        }
    }
    ipDataMgr.query({username:this.username},queryCallback);
};



Ip.prototype.remove = function(fn) {
    var fn = fn || function(){};
    ipDataMgr.remove({username:this.username},fn);
};


Ip.prototype.save = function(fn) {
    ipDataMgr.add({username:this.username,address:this.clientIp}, fn);
};

module.exports = Ip;