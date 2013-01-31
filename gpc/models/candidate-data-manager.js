var dataMgr = require('./data-manager');

var CandidateDataManager = CandidateDataManager || {};
CandidateDataManager.db = dataMgr.table.candidates;

CandidateDataManager.queryCandidate = function(project, fn) {
  CandidateDataManager.db.find(project, fn);
}

CandidateDataManager.addCandidate = function(candidate, fn){
  CandidateDataManager.db.find(candidate, function(err, docs){
    if(!err){
      if (docs.length > 0) return fn(new Error('Exist'));
      else CandidateDataManager.db.save(candidate, fn);
    }else fn(err);
  });
}

CandidateDataManager.removeProject = function(candidate, fn){
  CandidateDataManager.db.remove(candidate, fn);
}

CandidateDataManager.updateCandidate = function(condition, update, fn){
  console.log(condition);
  CandidateDataManager.db.update(condition, {$set:update}, {multi:true}, fn);
}

exports.queryCandidate  = CandidateDataManager.queryCandidate;
exports.addCandidate    = CandidateDataManager.addCandidate;
exports.removeProject   = CandidateDataManager.removeProject;
exports.updateCandidate = CandidateDataManager.updateCandidate;