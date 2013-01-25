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

StatusKeeper.update = function(){
  StatusKeeper.lock = true;
  StatusKeeper.status = StatusKeeper.bufferStatus;
  StatusKeeper.lock = false
}

StatusKeeper.query = function(fn){
  if (StatusKeeper.lock) fn(false);
  else fn(true, StatusKeeper.status);
}

exports.update = StatusKeeper.update;
exports.query = StatusKeeper.query;