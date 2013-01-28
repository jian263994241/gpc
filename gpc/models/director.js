var candidateDataMgr = require('./candidate-data-manager');
var projectMgr = require('./project-manager');
var _ = require('underscore');

var Status = require('./status');

function Director (keeper) {
  this.source = new Array();
  this.candidate = {
    index: -1,
    data: null
  };
  this.project = {
    id: null,
    key: null
  }
  this.keeper = keeper;
  this.lock = false;
  this.status = null;
}

/**
 * Query and save the candidate data
 *
 * @param {JSON} {id, key} project info
 * @api private
 */
Director.prototype.getData = function(project) {
  var that = this;
  candidateDataMgr.queryCandidate(project, function(err, data){
    _.each(data, function(el, key, list){
      that.source.push(el);
    })
  })
};

/*
 * Change the status and notify statuskeeper to update
 *
 * @param {JSON} {status, data}
 * @param {Function} callback
 * @api private
 */
Director.prototype.changeStatus = function(config, fn) {
  console.log('changeStatus');
  if (this.lock)
    if ('function' === typeof fn) 
      return fn(new Error());
    else return;

  console.log('changeStatus>notify');
  this.lock = true;
  this.status = config.status;
  this.keeper.setBufferStatus(config);
  this.notify();
  this.lock = false;

  if('function' === typeof fn) return fn(null);
};

/*
 * notify observer to update
 * 
 * @api private
 */
Director.prototype.notify = function(){
  this.keeper.update();
}

/*
 * Set candidate data
 *
 * @param {int} index of candidate
 * @api private
 */
Director.prototype.setCandidate = function(index) {
  this.candidate.index = index;
  this.candidate.data = this.source[index];
};

/*
 * Define the status event
 *
 * @param {Status} Director status
 * @param {Function} callback
 * @api private
 */
Director.prototype.statusEvent = function(status, fn) {
  console.log('statusEvent');
  console.log(status);
  switch(status){
    case Status.prepare:
      return this.changeStatus({status: Status.prepare}, fn);
    case Status.show:
    case Status.process:
    case Status.end:
      if (this.candidate) return this.changeStatus({status: status, data: this.candidate}, fn);
      else return fn(new Error());
    default:
      fn(new Error());
  }
};

/*
 * Director init
 *
 * @param {Function} callback
 * @api private
 */
Director.prototype.init = function(fn) {
  var that = this;
  console.log('init');
  this.statusEvent(Status.prepare, function(err){
    if (err) return fn(err);
    that.getData(this.project);
    that.setCandidate(0);
    that.statusEvent(Status.show);
    fn(null);
  })
};


/**
 * register project to projectMgr.
 * if success, save project id in access project queue
 *
 * @param {JSON} {id, key}
 * @param {Function} callback
 *
 * @api public
 */
Director.prototype.register = function(project, fn) {
  var that = this;
  projectMgr.register(project, function(err, projectInfo){
    console.log(projectInfo)
    that.project = projectInfo;
    if(!err && projectInfo) that.init(fn);
    else fn(new Error());
  });
}

/**
 * @api public
 */
Director.prototype.unregister = function(project, fn){
  var that = this;
  projectMgr.unregister(project.id, function(err, success){
    if(!err && success) that.end(fn);
    else fn(new Error());
  });
}

/**
 * @api public
 */
Director.prototype.previous = function(fn){
  if (this.candidate.index > 0 && (this.status == Status.show || this.status == Status.end)) {
    this.setCandidate(this.candidate.index -1);
    this.statusEvent(Status.show, fn);
  }else{
    fn(new Error());
  }
}

Director.prototype.end = function(fn){
  // end of the project
}

/**
 * @api public
 */
Director.prototype.next = function(fn){
  if (this.candidate.index < this.source.length && (this.status == Status.show || this.status == Status.end)) {
    this.setCandidate(this.candidate.index +1);
    this.statusEvent(Status.show, fn);
  }else{
    fn(new Error());
  }
}

/**
 * @api private
 */
Director.prototype.startVote = function(fn){
  if (this.status == Status.show && this.candidate.index > -1) {
    this.statusEvent(Status.process, fn);
  }else{
    fn(new Error());
  }
}

/**
 * @api private
 */
Director.prototype.endVote = function(fn){
  if (this.status == Status.process) {
    this.statusEvent(Status.end, fn);
  }else{
    fn(new Error());
  }
}

/**
 * @api public
 */
Director.prototype.vote = function(fn){
  var that = this;
  this.startVote(function(err){
    if(!err) setTimeout(function() {
      that.endVote(fn);
    }, 30000);
  })
}

module.exports = Director;