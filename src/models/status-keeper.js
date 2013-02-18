/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

// Declare required lib
var Status = require('./status');

/**
 * StatusKeeper store the unique working status 
 * and relative info for client query
 */
function StatusKeeper (fn) {
  this.status = Status.init;
  this.candidate = null;

  this.bufferStatus = Status.init;
  this.bufferCandidate = null;

  this.lock = false;
  this.action = fn;
}

/**
 * Set status to buffer region
 *
 * @param {Status}
 * @param {JSON} data relate to status
 *
 * @api public
 */
StatusKeeper.prototype.setBufferStatus = function(param) {
  this.bufferStatus = param.status;
  this.bufferCandidate = param.candidate;
};

/**
 * Update status and data
 *
 * @api public
 */
StatusKeeper.prototype.update = function() {
  this.lock = true;
  this.status = this.bufferStatus;
  this.candidate - this.bufferCandidate;
  this.lock = false
  if ('function' == typeof this.action) this.action();
};


/**
 * Query status and data
 *
 * @param {Function} callback {updated, record} 
 */
StatusKeeper.prototype.query = function(fn) {
  var that = this;
  if (this.lock) return fn(false);
  else return fn(true, {
    status: that.status,
    candidate: that.candidate
  });
};

module.exports = StatusKeeper;