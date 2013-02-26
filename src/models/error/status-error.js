/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
 
var util = require("util");
var AbstractError = require('./abstract-error');

var StatusError = module.exports = function(msg, constr){
   StatusError.super_.call(this, msg, this.constructor)
}

util.inherits(StatusError, AbstractError);

StatusError.prototype.name = 'Condition does not match the status.';