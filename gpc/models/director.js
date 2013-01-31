var candidateDataMgr = require('./candidate-data-manager');
var projectMgr = require('./project-manager');
var _ = require('underscore');

var Status = require('./status');
var StatusKeeper = require('./status-keeper');
var Marker = require('./marker');

function Director (project) {
  this.source = new Array();
  this.candidate = {
    index: -1,
    data: null
  };
  this.project = project
  this.queue = new Array();

  var that = this;
  this.keeper = new StatusKeeper(function(){
    while(res = that.queue.shift()){
      res.json({status: that.status, candidate: that.candidate});
    }
  });

  this.lock = false;
  this.status = null;
  this.marker = null;
}

/**
 * Query and save the candidate data
 *
 * @param {JSON} {id, key} project info
 * @api private
 */
Director.prototype.getData = function(project, fn) {
  var that = this;
  candidateDataMgr.queryCandidate({project:project.id}, function(err, data){
    _.each(data, function(el, key, list){
      console.log('***************************');
      console.log(el)

      that.source.push(el.data);
    });
    fn(err);
  });
};

/*
 * Change the status and notify statuskeeper to update
 *
 * @param {JSON} {status, data}
 * @param {Function} callback
 * @api private
 */
Director.prototype.changeStatus = function(config, fn) {
  if (this.lock)
    if ('function' === typeof fn) 
      return fn(new Error());
    else return;

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
 * !!Not Good Enough!!
 *
 * @param {Function} callback
 * @api private
 */
Director.prototype.init = function(fn) {
  var that = this;
  this.statusEvent(Status.prepare, function(err){
    if (err) return fn(err);
    that.getData(that.project, function(cerr){
      that.setCandidate(0);
      that.statusEvent(Status.show);
      fn(cerr);
    });
  })
};


/**
 * @deprecated
 *
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
    that.project = projectInfo;
    if(!err && projectInfo) that.init(fn);
    else fn(new Error());
  });
}

/**
 * @deprecated
 *
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
    this.marker = null;
    this.setCandidate(this.candidate.index -1);
    this.statusEvent(Status.show, fn);
  }else{
    fn(new Error());
  }
}

Director.prototype.save = function(fn) {
  var that = this;
  candidateDataMgr.queryCandidate({data: this.candidate.data}, function(err, data){
    var el = data;
    if (el.length > 0) candidateDataMgr.updateCandidate({data:el[0].data}, {marks:that.marker.getMarks(), average:that.marker.average}, fn);
    else fn(new Error());
  });
};

Director.prototype.end = function(fn){
  // end of the project
}

/**
 * @api public
 */
Director.prototype.next = function(fn){
  if (this.candidate.index < this.source.length-1 && (this.status == Status.show || this.status == Status.end)) {
    this.marker = null;
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
  if (this.candidate && this.candidate.index > -1) {
    this.marker = new Marker({candidate: this.candidate, project: this.project});
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
 * @deprecated
 *
 * @api public
 * 
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