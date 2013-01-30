var dataMgr = require('./data-manager');

var CandidateDataManager = CandidateDataManager || {};
CandidateDataManager.db = dataMgr.table.candidates;

CandidateDataManager.queryCandidate = function(project, fn) {
  console.log(project);

  CandidateDataManager.db.find(project, fn);


  // var data = [{
  //   title: 'McDonald JJ',
  //   type: 'image',
  //   intro: 'McDonald’s will open franchises to individuals in Central and West China such as Sichuan Province and Chongqing, which has been confirmed by McDonald’s (China).',
  //   source: 'http://farm1.staticflickr.com/19/100143024_fb5983b2ae_b.jpg',
  //   author: 'Ukey'
  // },{
  //   title: 'McDonald MV',
  //   intro: 'SOGO. McDonald’s will open franchises to individuals in Central and West China such as Sichuan Province and Chongqing, which has been confirmed by McDonald’s (China).',
  //   type: 'image',
  //   source: 'http://farm1.staticflickr.com/58/208945647_18d8df3a21_b.jpg',
  //   author: 'Michael'
  // }]
  // fn(null, data);
  // CandidateDataManager.db.find({project: project.id}, fn);
}

CandidateDataManager.addCandidate = function(candidate, fn){
  console.log('add candidate');
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

exports.queryCandidate = CandidateDataManager.queryCandidate;
exports.addCandidate = CandidateDataManager.addCandidate;
exports.removeProject = CandidateDataManager.removeProject;