var util = require("util");
var AbstractError = require('./abstract-error');

var UserExistError = module.exports = function(msg, constr){
   UserExistError.super_.call(this, msg, this.constructor)
}

util.inherits(UserExistError, AbstractError);

UserExistError.prototype.name = 'User Exist in Database Error';