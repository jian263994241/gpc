/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
 
var util = require("util");

/**
 * @see http://dustinsenos.com/articles/customErrorsInNode
 */
var AbstractError = module.exports = function(msg, constr){
  Error.captureStackTrace(this, constr || this);
  this.message = msg || 'Error';
}

util.inherits(AbstractError, Error);

AbstractError.prototype.name = 'Abstract Error';