/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

// Declare required lib
var _           = require('underscore');
var MarkDataMgr = require('./data-manager/mark-data-manager');
var AuthError   = require('./error/thread-lock-error');

// Init
var markDataMgr = new MarkDataMgr();

function Marker(params){
  this.candidate = params.candidate;
  this.project = params.project;

  this.isLocked = true;
  this.marks = new Array();
  this.average = 0;
}

/**
 * Collect the mark and commects submitted from users
 * 
 * @param {JSON} candidate and mark data
 * @param {Function} {error} callback
 *
 * @api public 
 */
Marker.prototype.collect = function(params, fn) {
  var candidate = params.candidate;
  var mark = params.mark;

  if (candidate && candidate._id == this.candidate._id && !this.isLocked) {

    var check = _.where(this.marks, {username: mark.username});
    if (check.length == 0) {
      this.marks.push(mark);
      this.calculateAverage();
    };
    fn(null);
  }else{
    fn(new AuthError());
  }
};

/**
 * Calculate the average score of marks
 * 
 * @api public 
 */
Marker.prototype.calculateAverage = function() {
  this.average = 0;
  if (this.marks && this.marks.length > 0 ) {
    var sum = 0;
    _.each(this.marks, function(mark, key, list){
      sum += parseInt(mark.score);
    });
    this.average = sum / this.marks.length;
    this.average = Math.floor(this.average * 100) / 100
  };
};

/**
 * Reset the status of mark
 * 
 * @api public 
 */
Marker.prototype.reset = function() {
  this.isLocked = false;
  this.marks = new Array();
};

/**
 * Save the marks to database
 * 
 * @api public 
 */
Marker.prototype.save = function(fn) {
  markDataMgr.add({
    candidate: this.candidate._id,
    project: this.project._id,
    marks: this.marks,
    average: this.average
  }, fn);
};

module.exports = Marker;