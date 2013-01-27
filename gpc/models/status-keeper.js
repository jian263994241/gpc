var Status = require('./status');

function StatusKeeper () {
  this.status = {
    status: Status.unknown,
    data: null
  };

  this.bufferStatus = {
    status: Status.unknown,
    data: null
  }

  this.lock = false;
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
};

module.exports = StatusKeeper;