/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
 
var util = require("util");
var AbstractError = require('./abstract-error');

var AuthError = module.exports = function(msg, constr){
   AuthError.super_.call(this, msg, this.constructor)
}

util.inherits(AuthError, AbstractError);

AuthError.prototype.name = 'Authentication Failed.';