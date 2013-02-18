/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
 
var util = require("util");
var AbstractError = require('./abstract-error');

var ProjectExistError = module.exports = function(msg, constr){
   ProjectExistError.super_.call(this, msg, this.constructor)
}

util.inherits(ProjectExistError, AbstractError);

ProjectExistError.prototype.name = 'Project exist in access queue.';