/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
 
var util = require("util");
var AbstractError = require('./abstract-error');

var UnknownError = module.exports = function(msg, constr){
   UnknownError.super_.call(this, msg, this.constructor)
}

util.inherits(UnknownError, AbstractError);

UnknownError.prototype.name = 'Unknown error.';