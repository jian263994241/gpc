// var VoteOperation = require('../operation/vote-operation');
// var LoginOperation = require('../operation/login-operation');
// var RegisterOperation = require('../operation/register-operation');
var ManageOperation = require('../operation/manage-operation');

// // Director
// exports.directorVisit = function(req, res){
//   if(req.session.project) 
//     res.render('director');
//   else
//     res.redirect('/director/login');
// }

// exports.directorLogin = function(req, res){
//   if(req.session.project) 
//     res.redirect('/director');
//   else
//     res.render('director-login');
// }

// exports.directorLoginSubmit = VoteOperation.directorLoginSubmit;
// exports.directorExec = VoteOperation.directorExec;
// exports.closeProject = VoteOperation.closeProject;

// // Director for client
// exports.queryStatus = VoteOperation.queryStatus;
// exports.collectMarker = VoteOperation.collectMarker;
// exports.selectProject = VoteOperation.selectProject;

// exports.voteForm = function(req, res){
//   if (req.session.project && req.session.user) res.render('vote');
//   else res.redirect('/home');
// }

// exports.userLogin = LoginOperation.userLogin;
// exports.userLoginSubmit = LoginOperation.userLoginSubmit;
// exports.userLogoutSubmit = LoginOperation.userLogoutSubmit;
// exports.searchProject = LoginOperation.searchProject; 

// exports.userRegister = RegisterOperation.userRegister;
// exports.userRegisterSubmit = RegisterOperation.userRegisterSubmit;

exports.projectManagement = ManageOperation.setProjectList;
exports.addProject = ManageOperation.addProject;
exports.removeProject = ManageOperation.removeProject;
exports.queryAllProjects = ManageOperation.queryAllProjects;

exports.candidateManagement = ManageOperation.setCandidates;
exports.queryAllCandidates = ManageOperation.queryAllCandidates;
exports.addCandidate = ManageOperation.addCandidate;
exports.removeCandidate = ManageOperation.removeCandidate;

// GET: /director/result?project=projectId
exports.showResult = function(req, res){
  if(req.session.project) 
    res.render('result');
  else
    res.redirect('/director/login');
}

// GET: /management
exports.renderLoginManagementView = ManageOperation.renderLoginManagementView;

exports.loginManagement = ManageOperation.loginManagement;
exports.logoutManagement = ManageOperation.logoutManagement;

exports.projectCandidatesManagement = ManageOperation.setProjectCandidates;
exports.queryProjectCandidates = ManageOperation.queryProjectCandidates;
exports.insertCandidateIntoProject = ManageOperation.insertCandidateIntoProject;
exports.removeCandidateFromProject = ManageOperation.removeCandidateFromProject;