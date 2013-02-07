/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
 
var util = require("util");
var AbstractError = require('./abstract-error');

var ThreadLock = module.exports = function(msg, constr){
   ThreadLock.super_.call(this, msg, this.constructor)
}

util.inherits(ThreadLock, AbstractError);

ThreadLock.prototype.name = 'Thread Lock';