var _ = require('underscore');

var Director = require('../models/director');
var StatusKeeper = require('../models/status-keeper.js');

var projectMgr = require('../models/project-manager');
var userCenter = require('../models/user-center');

var DirectorAction = {
  init: 'init',
  prev: 'prev',
  next: 'next',
  startVote: 'start_vote',
  endVote: 'end_vote',
  save: 'save'
}

var VoteOperation = VoteOperation || {};

VoteOperation.login = function(req, res) {
  var id = req.body['id'];
  var key = req.body['key'];

  projectMgr.register({id:id, key: key}, function(err, director){
    if(!err && director){
      director.init(function(err){
        if (err) return res.json({error:'Authentication failed, please check project id and key'});
        else {
          req.session.regenerate(function(){
            req.session.project = director.project;
            res.json({success:true, redirect:'/director'});
          });
        }
      });
    }
    else return res.json({error:'Authentication failed, please check project id and key'});
  });
}

VoteOperation.exec = function(req, res){
  var action = req.body['action'];

  var director = VoteOperation.getDirector(req.session.project);

  if (!director) return req.session.destroy(function(){
    res.json({error:true, redirect: '/director/login'});
  });

  switch(action){
    case DirectorAction.init:
      return res.json({candidate: director.candidate, project: director.project});
    case DirectorAction.prev:
      return director.previous(function(err){
        if (err) return res.json({error: true});
        res.json({candidate: director.candidate, project: director.project});
      });
    case DirectorAction.next:
      return director.next(function(err){
        if (err) return res.json({error: true});
        res.json({candidate: director.candidate, project: director.project});
      });
    case DirectorAction.startVote:
      return director.startVote(function() {
        if(director.marker) director.marker.unlock();
        res.send('start');
      });
    case DirectorAction.endVote:
      return director.endVote(function() {
        if(director.marker) director.marker.lock();
        res.send('end');
      });
    case DirectorAction.save:
      // director ask marker to save data
      return;
    default:
      return res.json({error: 'Authentication Failed'});
  }
}

VoteOperation.getDirector = function(project){
  var director = null;

  if (project) director = projectMgr.getDirector(project);
  return director;
}

VoteOperation.search = function(req, res){
  var projectId = req.params.project;
  var director = projectMgr.getDirector({id: projectId});
  if (director && director.project) {
    req.session.project = director.project;
    res.redirect('/director/vote');
  }else{
    res.redirect('/home');
  }
}

VoteOperation.query = function(req, res){
  var status = req.body['status'];
  var candidate = req.body['candidate'];
  var project = req.session.project;

  var director = VoteOperation.getDirector(project);
  if (!director) return req.session.destroy(function(){
    res.json({redirect: '/director/login'});
  });

  if (!candidate || !status) return res.json({status: director.status, candidate: director.candidate});

  if (director.status == status && director.candidate.index == candidate.index) director.queue.push(res);
  else res.json({status: director.status, candidate: director.candidate});
}

VoteOperation.collect = function(req, res){
  var candidate = req.body['candidate'];
  var mark = req.body['mark'];
  var project = req.session.project;

  var director = VoteOperation.getDirector(project);
  if (!director) return req.session.destroy(function(){
    res.json({redirect: '/director/login'});
  });

  if (candidate && mark && director.marker) {
    director.marker.collect({candidate: candidate, mark: mark}, function(err){
      if (!err) res.json({success: true});
      else res.json({error: 'Push Error'});
    });
  }else
    res.json({error: 'Param Error'});
}

exports.directorLoginSubmit = VoteOperation.login;
exports.directorExec = VoteOperation.exec;
exports.queryStatus = VoteOperation.query;
exports.collectMarker = VoteOperation.collect;
exports.selectProject = VoteOperation.search;
