/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
 
var util = require("util");
var AbstractError = require('./abstract-error');

var DataExistError = module.exports = function(msg, constr){
   DataExistError.super_.call(this, msg, this.constructor)
}

util.inherits(DataExistError, AbstractError);

DataExistError.prototype.name = 'Data exist in access queue.';