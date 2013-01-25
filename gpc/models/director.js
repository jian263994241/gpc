var candidateDataMgr = require('./user-data-manager');
var projectMgr = require('./project-manager');
var status = require('./status');
var _ = require('underscore');

var Director = Director || {};

Director.source = new Array();
Director.curCandidate = {
  index: -1,
  data: null
};
Director.projectId = -1;
Director.statusKeeper = null;
Director.status = status.init;
Director.lock = false;

/**
 * @api private
 */
Director.getData = function(projectId){
  candidateDataMgr.queryCandidate(projectId, function(err, data){
    _.each(data, function(el, key, list){
      Director.source.push(el);
    });
  });
}


/**
 * @api private
 */
Director.setStatusKeeper = function(statusKeeper){
  Director.statusKeeper = statusKeeper;
}

/**
 * @api private
 */
Director.changeStatus = function(config, fn){
  if (Director.lock) return if('Function' == typeof fn) fn(new Error());

  Director.lock = true;
  Director.status = config.status;
  Director.statusKeeper.setBufferStatus(config);
  Director.notify();
  Director.lock = false;

  return if('Function' == typeof fn) fn(null);
}

/**
 * @api private
 */
Director.notify = function(){
  Director.statusKeeper.update();
}

/**
 * @api private
 */
Director.setCurCandidate = function(index){
  Director.curCandidate.index = index;
  Director.curCandidate.data = Director.source[index];
}

/**
 * @api private
 */
Director.statusEvent = function(status, fn){
  switch(status){
    case status.prepare:
      return Director.changeStatus({status: status.prepare}, fn);
    case status.show:
    case status.process:
    case status.end:
      if (curCandidate) return Director.changeStatus({status: status, data: Director.curCandidate}, fn);
      else return fn(new Error());
    default:
      fn(new Error());
  }
}

/**
 * @api private
 */
Director.init = function(){
  Director.statusEvent(status.prepare, function(err){
    if (err) return fn(err);
    Director.getData(Director.projectId);
    Director.setCurCandidate(0);
    Director.statusEvent(status.show);
  });
}

/**
 * @api public
 */
Director.register = function(projectId, fn) {
  projectMgr.register(projectId, function(err, success){
    if(!err && success) Director.init(fn);
    else fn(new Error());
  });
}

/**
 * @api public
 */
Director.unregister = function(projectId, fn){
  projectMgr.unregister(projectId, function(err, success){
    if(!err && success) Director.end(fn);
    else fn(new Error());
  });
}

/**
 * @api public
 */
Director.previous = function(fn){
  if (Director.curCandidate.index > 0 && (Director.status == status.show || Director.status == status.end)) {
    Director.setCurCandidate(Director.curCandidate.index -1);
    Director.statusEvent(status.show, fn);
  }else{
    fn(new Error());
  }
}

Director.end = function(fn){
  // end of the project
}

/**
 * @api public
 */
Director.next = function(fn){
  if (Director.curCandidate.index < Director.source.length && (Director.status == status.show || Director.status == status.end)) {
    Director.setCurCandidate(Director.curCandidate.index +1);
    Director.statusEvent(status.show, fn);
  }else{
    fn(new Error());
  }
}

/**
 * @api private
 */
Director.startVote = function(fn){
  if (Director.status == status.show && Director.curCandidate.index > -1) {
    Director.statusEvent(status.process, fn);
  }else{
    fn(new Error());
  }
}

/**
 * @api private
 */
Director.endVote = function(fn){
  if (Director.status == status.process) {
    Director.statusEvent(status.end, fn);
  }else{
    fn(new Error());
  }
}

/**
 * @api public
 */
Director.vote = function(fn){
  Director.startVote(function(err){
    if(!err) setTimeout(function() {
      Director.endVote(fn);
    }, 10000);
  })
}

exports.vote = Director.vote;
exports.register = Director.register;
exports.next = Director.next;
exports.previous = Director.previous;
exports.unregister = Director.unregister;
