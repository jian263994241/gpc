var _             = require('underscore');

var projectMgr    = require('../models/project-manager');
var userCenter    = require('../models/user-center');

var DirectorAction = {
  init: 'init',
  prev: 'prev',
  next: 'next',
  startVote: 'start_vote',
  endVote: 'end_vote',
  save: 'save'
}

var VoteOperation = exports = module.exports = {};

VoteOperation.renderDirectorView = function(req, res){
  if(req.session.project) 
    res.render('director');
  else
    res.redirect('/director/login');
}

VoteOperation.renderDirectorLoginView = function(req, res){
  if(req.session.project) 
    res.redirect('/director');
  else
    res.render('login', {
      js_control_file: '/director/director-login',
      is_need: false,
      login_title: 'Project Login',
      guide_link: '',
      guide_link_title: '',
      username_title: 'Project',
      password_title: 'Key',
      submit_button_title: 'Sign in',
      is_need_remember: false
    });
}

VoteOperation.renderVoteFormView = function(req, res){
  if (req.session.project && req.session.user) res.render('vote');
  else res.redirect('/home');
}

VoteOperation.renderResultView = function(req, res){
  if(req.session.project) 
    res.render('result');
  else
    res.redirect('/director/login');
}

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

  console.log(action);

  switch(action){
    case DirectorAction.init:
      return res.json({candidate: director.curCandidate, project: director.project, status: director.status});
    case DirectorAction.prev:
      return director.previous(function(err){
        if (err) return res.json({error: true});
        res.json({candidate: director.curCandidate, project: director.project, status: director.status});
      });
    case DirectorAction.next:
      return director.next(function(err){
        if (err) return res.json({error: true});
        res.json({candidate: director.curCandidate, project: director.project, status: director.status});
      });
    case DirectorAction.startVote:
      return director.startVote(function() {
        if(director.marker) director.marker.reset();
        res.send('vote-start');
      });
    case DirectorAction.endVote:
      return director.endVote(function() {
        if(director.marker) director.marker.isLocked = true;
        res.send('vote-end');
      });
    case DirectorAction.save:
      return director.save(function(err){
        if(!err) res.send('save');
      });
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

  if (!candidate || !status) return res.json({status: director.status, candidate: director.curCandidate});

  if (director.status == status) director.queue.push(res);
  else res.json({status: director.status, candidate: director.curCandidate});
}

VoteOperation.collect = function(req, res){
  var candidate = req.body['candidate'];
  var mark = req.body['mark'];

  var project = req.session.project;
  var user = req.session.user;

  var director = VoteOperation.getDirector(project);
  if (!director) return req.session.destroy(function(){
    res.json({redirect: '/director/login'});
  });

  if (user && candidate && mark && director && director.marker) {
    mark.username = user.username;
    director.marker.collect({candidate: candidate, mark: mark}, function(err){
      if (!err) res.json({success: true});
      else res.json({error: 'Push Error'});
    });
  }else
    res.json({error: 'Param Error'});
}

VoteOperation.close = function(req, res){
  var director = VoteOperation.getDirector(req.session.project);
  if (!director) return req.session.destroy(function(){
    res.redirect('/director');
  });

  projectMgr.unregister(director, function(err){
    if (!err) return req.session.destroy(function(){
      res.redirect('/director/login');
    });
    else return res.redirect('/director/login');
  });
}


VoteOperation.result = function(req, res){
  var project = req.body['project'];
  var director = VoteOperation.getDirector(project);

  director.queryResult(res);
}