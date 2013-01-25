var dataMgr = require('./data-manager');

var CandidateDataManager = CandidateDataManager || {};
CandidateDataManager.db = dataMgr.table.candidates;

CandidateDataManager.queryCandidate = function(proejctId, fn) {
  var data = [{
    title: 'McDonald',
    type: 'image',
    source: 'http://farm1.staticflickr.com/19/100143024_fb5983b2ae_b.jpg',
    intro: 'McDonald introduction'
  },{
    title: 'McDonald',
    type: 'image',
    source: 'http://farm1.staticflickr.com/58/208945647_18d8df3a21_b.jpg',
    intro: 'McDonald introduction'
  }]
  fn(err, data);
  // CandidateDataManager.db.find({project: proejctId}, fn);
}

exports.queryCandidate = CandidateDataManager.queryCandidate;