function Marker(params){
  this.candidate = params.candidate;
  this.project = params.project;

  this.isLocked = true;
  this.marks = new Array();
}

Marker.prototype.collect = function(params, fn) {
  candidate = params.candidate;
  mark = params.mark;

  if (candidate && candidate.index == this.candidate.index && !this.isLocked) {
    this.marks.push(mark);
    fn(null);
  }else{
    fn(new Error('Auth Error'));
  }
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