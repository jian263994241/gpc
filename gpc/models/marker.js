var _           = require('underscore');
var markDataMgr = require('./data-manager/mark-data-manager');

function Marker(params){
  this.candidate = params.candidate;
  this.project = params.project;

  this.isLocked = true;
  this.marks = new Array();
  this.average = 0;
}

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
    fn(new Error('Authentication Failed'));
  }
};

Marker.prototype.calculateAverage = function() {
  this.average = 0;
  if (this.marks && this.marks.length > 0 ) {
    var sum = 0;
    _.each(this.marks, function(mark, key, list){
      sum += parseInt(mark.score);
    });
    this.average = sum / this.marks.length;
  };
};

Marker.prototype.reset = function() {
  this.isLocked = false;
  this.marks = new Array();
};

Marker.prototype.save = function(fn) {
  markDataMgr.add({
    candidate: this.candidate._id,
    project: this.project._id,
    marks: this.marks
  }, fn);
};

module.exports = Marker;