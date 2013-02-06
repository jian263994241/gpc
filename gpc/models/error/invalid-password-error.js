/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
 
var util = require("util");
var AbstractError = require('./abstract-error');

var InvalidPasswordError = module.exports = function(msg, constr){
   InvalidPasswordError.super_.call(this, msg, this.constructor)
}

util.inherits(InvalidPasswordError, AbstractError);

InvalidPasswordError.prototype.name = 'Invalid Password Error';