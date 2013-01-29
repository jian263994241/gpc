var VoteOperation = require('../operation/vote-operation');

// Director
exports.directorVisit = function(req, res){
  if(req.session.project) 
    res.redirect('/director');
  else
    res.render('/director/login');
}

exports.directorLogin = VoteOperation.directorLogin;
exports.directorExec = VoteOperation.directorExec;

// Director for client
exports.queryStatus = VoteOperation.queryStatus;
exports.collectMarker = VoteOperation.collectMarker;