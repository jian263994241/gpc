/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
 
var util = require("util");
var AbstractError = require('./abstract-error');

var NoStatusError = module.exports = function(msg, constr){
   NoStatusError.super_.call(this, msg, this.constructor)
}

util.inherits(NoStatusError, AbstractError);

NoStatusError.prototype.name = 'No such status.';