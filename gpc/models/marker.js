var _ = require('underscore');

function Marker(params){
  this.candidate = params.candidate;
  this.project = params.project;

  this.isLocked = true;
  this.marks = new Array();
  this.average = 0;
}

Marker.prototype.collect = function(params, fn) {
  candidate = params.candidate;
  mark = params.mark;

  if (candidate && candidate.index == this.candidate.index && !this.isLocked) {
    this.marks.push(mark);
    this.calculateAverage();
    fn(null);
  }else{
    fn(new Error('Auth Error'));
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
  this.unlock();
  this.marks = new Array();
};

Marker.prototype.getMarks = function() {
  return this.marks;
};

Marker.prototype.lock = function() {
  this.isLocked = true;
};

Marker.prototype.unlock = function() {
  this.isLocked = false;
};

module.exports = Marker;