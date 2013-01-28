var Status = require('./status');

function StatusKeeper (fn) {
  this.status = {
    status: Status.unknown,
    data: null
  };

  this.bufferStatus = {
    status: Status.unknown,
    data: null
  }

  this.lock = false;
  this.action = fn;
}

StatusKeeper.prototype.setBufferStatus = function(status) {
  this.bufferStatus = status;
};

StatusKeeper.prototype.query = function(fn) {
  if (this.lock) return fn(false);
  else return fn(true, this.status);
};

StatusKeeper.prototype.update = function() {
  this.lock = true;
  this.status = this.bufferStatus;
  this.lock = false
  if ('function' == typeof this.action) this.action();
};


module.exports = StatusKeeper;