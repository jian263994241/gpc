/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

 // Declare required lib
var _                   = require('underscore');

var projectMgr          = require('../models/project-manager');
var userCenter          = require('../models/user-center');
var ProjectExistError   = require('../models/error/project-exist-error');

// Director action definition
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
 * Director and Submit page view controller
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
VoteOperation.render = function(req, res){
  switch(req.route.path){
    case '/director':
    case '/director/result/:project':
      if (req.session) {
        if (req.session.admin){
          return res.redirect('/management');
        }else if(req.session.user){
          return res.redirect('/');
        }
      };
      if(req.session.project) return res.render('main');
      else return res.redirect('/director/login');
    case '/director/vote/:project':
      if (req.session && req.session.admin) return res.redirect('/management');
      if (req.session.project) {
        return res.render('main');
      }else{
        return res.redirect('/');
      }
    default:
      return res.render('main');
  }
}

/**
 * Add project into access queue
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
VoteOperation.accessedProject = function(req, res){
  if (req.session.user) {
    res.json({directors: projectMgr.accessQueue});
  };
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
    else if (err && err instanceof ProjectExistError)
      return res.json({error: 'Authentication failed. Project is running!'});
    else
      return res.json({error:'Authentication failed, please check project id and key'});
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
        console.log('****************************');
        console.log('DirectorAction.result');
        console.log(data);
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
    res.json({success:true, redirect:'/director/login'});
  });

  projectMgr.unregister(director, function(err){
    if (!err) return req.session.destroy(function(){
      res.json({success:true, redirect:'/director/login'});
    });
    else return res.json({error:'Logout Error'});
  });
}

/**
 * Create session.project for client
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
VoteOperation.open = function(req, res){
  if (req.session.project) return res.json({success:true});

  var projectId = req.body['id'];

  var director = projectMgr.getDirector({id: projectId});
  if (director) {
    req.session.project = director.project;
    return res.json({success:true});
  }else res.json({error: 'no such project director running'});
}

/**
 * For user to query status
 * keep debug status
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

  if (!project) return res.json({error: 'project not open'});

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