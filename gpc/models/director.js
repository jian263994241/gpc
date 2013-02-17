/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

// Declare required lib
var projectDataMgr    = require('./data-manager/project-data-manager');
var candidateDataMgr  = require('./data-manager/candidate-data-manager');
var markDataMgr       = require('./data-manager/mark-data-manager');
var projectMgr        = require('./project-manager');
var _                 = require('underscore');

var Status            = require('./status');
var StatusKeeper      = require('./status-keeper');
var Marker            = require('./marker');
var ObjectID          = require('mongodb').ObjectID;

var ThreadLockError   = require('./error/thread-lock-error');

/**
 * Class Director
 */
function Director (project) {
  this.source = new Array();
  this.curCandidate = null;
  this.curCandidateIndex = -1;
  this.project = project;
  this.queue = new Array();
  this.lock = false;
  this.status = null;
  this.marker = null;

  var that = this;
  this.keeper = new StatusKeeper(function(){
    while(res = that.queue.shift()){
      res.json({status: that.status, candidate: that.candidate});
    }
  });
}

/*
 * Notify observer to update
 * 
 * @api private
 */
Director.prototype.notify = function(){
  this.keeper.update();
}

/*
 * Change the status and notify statuskeeper to update
 *
 * @param {JSON} {status, candidate}
 * @param {Function} callback
 * @api private
 */
Director.prototype.changeStatus = function(config, fn) {
  if (this.lock)
    if ('function' === typeof fn) 
      return fn(new ThreadLockError());
    else return;

  this.lock = true;
  this.status = config.status;
  this.keeper.setBufferStatus(config);
  this.notify();
  this.lock = false;

  if('function' === typeof fn) return fn(null);
};

/*
 * Set candidate data
 *
 * @param {int} index of candidate
 * @api private
 */
Director.prototype.setCandidate = function(index) {
  this.curCandidateIndex = index;
  this.curCandidate = this.source[index];
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
      return this.changeStatus({status: Status.prepare, candidate: null}, fn);
    case Status.show:
    case Status.process:
    case Status.end:
      if (this.curCandidate) return this.changeStatus({status: status, candidate: this.curCandidate}, fn);
      else return fn(new Error());
    default:
      fn(new Error());
  }
};

/**
 * Query and save the candidate data
 *
 * @param {JSON} {id, key} project info
 * @api private
 */
Director.prototype.getData = function(project, fn) {
  var that = this;
  projectDataMgr.query(project, function(err, records){
    if (!err && records) {
      var candidateArr = records[0].candidates;
      var sen = new Array();
      _.each(candidateArr, function(el, index, list){
        sen.push({_id: new ObjectID(el)});
      });

      if(sen.length == 0) return fn(new Error());

      candidateDataMgr.query({$or: sen}, function(err, records){
        that.source = records;
        fn(err);
      });
    };
  });
};

/*
 * Director init
 *
 * @param {Function} callback
 *
 * @api private
 */
Director.prototype.init = function(fn) {
  var that = this;
  this.statusEvent(Status.prepare, function(err){
    if (err) return fn(err);
    that.getData(that.project, function(e){
      that.setCandidate(0);
      that.statusEvent(Status.show);
      fn(e);
    });
  })
};


/**
 * Switch candidate to the previous one
 *
 * @param {Function} callback
 *
 * @api public
 */
Director.prototype.previous = function(fn){
  if (this.curCandidateIndex > 0 && (this.status == Status.show || this.status == Status.end)) {
    this.marker = null;
    this.setCandidate(this.curCandidateIndex -1);
    this.statusEvent(Status.show, fn);
  }else{
    fn(new Error());
  }
}

/**
 * Switch candidate to the next one
 *
 * @param {Function} callback
 *
 * @api public
 */
Director.prototype.next = function(fn){
  if (this.curCandidateIndex < this.source.length-1 && (this.status == Status.show || this.status == Status.end)) {
    this.marker = null;
    this.setCandidate(this.curCandidateIndex +1);
    this.statusEvent(Status.show, fn);
  }else{
    fn(new Error());
  }
}

/**
 * Start Vote
 *
 * @param {Function} callback
 *
 * @api public
 */
Director.prototype.startVote = function(fn){
  if (this.curCandidate && this.curCandidateIndex > -1) {
    this.marker = new Marker({candidate: this.curCandidate, project: this.project});
    this.statusEvent(Status.process, fn);
  }else{
    fn(new Error());
  }
}

/**
 * End Vote
 *
 * @param {Function} callback
 *
 * @api public
 */
Director.prototype.endVote = function(fn){
  if (this.status == Status.process) {
    this.statusEvent(Status.end, fn);
  }else{
    fn(new Error());
  }
}

/**
 * Save mark into database
 *
 * @param {Function} callback
 *
 * @api public
 */
Director.prototype.save = function(fn) {
  if (this.marker){
    this.marker.save(fn);
  };
};

/**
 * Query the result from mark colletion
 *
 * @param {Function} callback function(err){}
 *
 * @api public
 */
Director.prototype.result = function(fn) {
  var that = this;
  projectDataMgr.query(this.project, function(err, records){
    if (!err && records.length > 0) {
      var candidateArr = records[0].candidates;
      var sen = new Array();
      _.each(candidateArr, function(el, index, list){
        sen.push({_id: new ObjectID(el)});
      });

      if(sen.length == 0) return fn({marks:[]});

      candidateDataMgr.query({$or: sen}, function(er, re){
        if (er) return fn({error: 'error'});
        
        sen = new Array();
        _.each(re, function(el, index, list){
          sen.push({candidate: el._id});
        });

        markDataMgr.query({$or: sen}, function(e, r){

          if (!e && r) return fn({candidates: re, marks: r});
          else return fn({error: 'error'});
        });
      });
    };
  });
};

module.exports = Director;