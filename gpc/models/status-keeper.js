var status = require('./status');

var StatusKeeper = StatusKeeper || {};

StatusKeeper.status = {
  status: status.unknown,
  data: null
};

StatusKeeper.bufferStatus = {
  status: status.unknown,
  data: null
};

StatusKeeper.lock = false;

StatusKeeper.setBufferStatus = function(status){
  StatusKeeper.bufferStatus = status;
}

StatusKeeper.update = function(){
  StatusKeeper.lock = true;
  StatusKeeper.status = StatusKeeper.bufferStatus;
  StatusKeeper.lock = false
}

StatusKeeper.query = function(fn){
  if (StatusKeeper.lock) return fn(false);
  else return fn(true, StatusKeeper.status);
}

exports.update = StatusKeeper.update;
exports.query = StatusKeeper.query;