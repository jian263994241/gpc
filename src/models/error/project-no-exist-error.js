/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
 
var util = require("util");
var AbstractError = require('./abstract-error');

var ProjectNoExistError = module.exports = function(msg, constr){
   ProjectNoExistError.super_.call(this, msg, this.constructor)
}

util.inherits(ProjectNoExistError, AbstractError);

ProjectNoExistError.prototype.name = 'Project not exist in database.';