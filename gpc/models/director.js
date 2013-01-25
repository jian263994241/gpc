var candidateDataMgr = require('./user-data-manager');
var projectMgr = require('./project-manager');
var _ = require('underscore');

var Director = Director || {};

Director.source = new Array();
Director.curIndex = -1;
Director.projectId = -1;

Director.vote = function() {
  
}

Director.getData = function(projectId){
  candidateDataMgr.queryCandidate(projectId, function(err, data){
    _.each(data, function(el, key, list){
      Director.source.push(el);
    });
  });
}

Director.register = function(projectId, fn) {
  projectMgr.register(projectId, fn);
}

Director.unregister = function(projectId, fn){
  projectMgr.unregister(projectId, fn);
}