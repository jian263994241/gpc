/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
 
var util = require("util");
var AbstractError = require('./abstract-error');

var NoUserError = module.exports = function(msg, constr){
   NoUserError.super_.call(this, msg, this.constructor)
}

util.inherits(NoUserError, AbstractError);

NoUserError.prototype.name = 'No User Error';