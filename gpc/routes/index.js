var VoteOperation = require('../operation/vote-operation');
var LoginOperation = require('../operation/login-operation');
var RegisterOperation = require('../operation/register-operation');

// Director
exports.directorVisit = function(req, res){
  if(req.session.project) 
    res.render('director');
  else
    res.redirect('/director/login');
}

exports.directorLogin = function(req, res){
  if(req.session.project) 
    res.redirect('/director');
  else
    res.render('director-login');
}

exports.directorLoginSubmit = VoteOperation.directorLoginSubmit;
exports.directorExec = VoteOperation.directorExec;

// Director for client
exports.queryStatus = VoteOperation.queryStatus;
exports.collectMarker = VoteOperation.collectMarker;
exports.selectProject = VoteOperation.selectProject;

exports.voteForm = function(req, res){
  if (req.session.project && req.session.user) res.render('vote');
  else res.redirect('/home');
}

exports.userLogin = LoginOperation.userLogin;
exports.userLoginSubmit = LoginOperation.userLoginSubmit;
exports.userLogoutSubmit = LoginOperation.userLogoutSubmit;
exports.searchProject = LoginOperation.searchProject; 

exports.userRegister = RegisterOperation.userRegister;
exports.userRegisterSubmit = RegisterOperation.userRegisterSubmit;