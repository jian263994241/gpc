var _             = require('underscore');

var projectMgr    = require('../models/project-manager');
var userCenter    = require('../models/user-center');

var DirectorAction = {
  init: 'init',
  prev: 'prev',
  next: 'next',
  startVote: 'start_vote',
  endVote: 'end_vote',
  save: 'save',
  result: 'result'
}

var VoteOperation = exports = module.exports = {};

/**
 * Get director according to project
 *
 * @param {JSON} project data object
 *
 * @api private
 */
var getDirector = function(project){
  var director = null;
  if (project) director = projectMgr.getDirector(project);
  return director;
}

/**
 * Render director view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
VoteOperation.renderDirectorView = function(req, res){
  if(req.session.project) 
    res.render('director');
  else
    res.redirect('/director/login');
}

/**
 * Render director login view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
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

/**
 * Render result view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
VoteOperation.renderResultView = function(req, res){
  if(req.session.project) 
    res.render('result');
  else
    res.redirect('/director/login');
}

/**
 * Render vote form view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
VoteOperation.renderVoteFormView = function(req, res){
  if (req.session.project && req.session.user) res.render('vote');
  else res.redirect('/home');
}

/**
 * Director of project login
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
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

/**
 * Director execution
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
VoteOperation.exec = function(req, res){
  var action = req.body['action'];

  var director = getDirector(req.session.project);

  if (!director) return req.session.destroy(function(){
    res.json({error:true, redirect: '/director/login'});
  });

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
    case DirectorAction.result:
      return director.result(function(data){
        res.json(data);
      });
    default:
      return res.json({error: 'Authentication Failed'});
  }
}

/**
 * Director close project
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
VoteOperation.close = function(req, res){
  var director = getDirector(req.session.project);
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

/**
 * User guide after login
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
VoteOperation.search = function(req, res){
  var projectId = req.params.project;
  var director = getDirector({id: projectId});
  if (director && director.project) {
    req.session.project = director.project;
    res.redirect('/director/vote');
  }else{
    res.redirect('/home');
  }
}

/**
 * User query status
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
VoteOperation.query = function(req, res){

  console.log('***************************');
  console.log('query');

  var status = req.body['status'];
  var candidate = req.body['candidate'];
  var project = req.session.project;

  console.log('project: '+project);

  var director = getDirector(project);
  if (!director) return req.session.destroy(function(){
    res.json({redirect: '/login'});
  });

  console.log('candidate: '+candidate);
  console.log('status: '+status);

  if (!candidate || !status) return res.json({status: director.status, candidate: director.curCandidate});

  console.log('director.status: '+director.status);
  console.log('director.curCandidate: '+director.curCandidate);

  if (director.status == status) director.queue.push(res);
  else res.json({status: director.status, candidate: director.curCandidate});
}

/**
 * Collect user submitted mark
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
VoteOperation.collect = function(req, res){
  var candidate = req.body['candidate'];
  var mark = req.body['mark'];

  var project = req.session.project;
  var user = req.session.user;

  var director = getDirector(project);
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