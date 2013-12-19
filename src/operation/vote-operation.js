/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

 // Declare required lib
var _                   = require('underscore');
var projectMgr          = require('../models/project-manager');
var ProjectExistError   = require('../models/error/project-exist-error');
var userCenter          = require('../models/user-center');

// Director action definition
var DirectorAction = {
  init: 'init',
  prev: 'prev',
  next: 'next',
  startVote: 'start_vote',
  endVote: 'end_vote',
  save: 'save',
  result: 'result',
  query: 'query',
  process:'process'
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
var filter_id  = function(origin,origin_id,b_id){
    return _.filter(origin,function(m){
        return String(b_id) == String(m[origin_id]);
    })[0]
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
      if (req.session) 
        if (req.session.admin) return res.redirect('/management');
        else if(req.session.user) return res.redirect('/');
        else if(req.session.project) return res.render('main');
      else return res.redirect('/director/login');
    case '/director/vote/:project':
      if (req.session) 
        if (req.session.admin) return res.redirect('/management');
        else if(req.session.user) return res.render('main');
        else if(req.session.project) return res.render('/director');
      else return res.redirect('/');
    case '/director/login':
      if(req.session.project) return res.redirect('/director');
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
  console.log('VoteOperation.accessedProject');
  if (req.session.user) {
    var projects = new Array();
    _.each(projectMgr.accessQueue, function(el, index, list){
      projects.push(el.project);
    });

    console.log('VoteOperation.projects****************************');
    console.log(projects);
    
    res.json({projects: projects});
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

  register();

  function register(){
      projectMgr.register({id:id, key: key}, function(err, director){


          if(!err && director){

              var regenerateCallback = function(){
                  req.session.project = director.project;
                  req.session.timelog = director.timelog;
                  res.json({success:true, redirect:'/director'});
              }
              var callback = function(err){
                  if (err) {
                      return res.json({error:'Authentication failed, please check project id and key'});
                  } else {
                      req.session.regenerate(regenerateCallback);
                  }
              }
              director.init(callback);
          }
          else if (err && err instanceof ProjectExistError){


              projectMgr.unregister(getDirector({id:id, key: key}), register);

//              return res.json({error: 'Authentication failed. Project is running!'});
          }else{
              console.error('vote-operation-file-139',err);
              return res.json({error:'Authentication failed, please check project id and key'});
          }

      });
  }

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

  if(director&&director.timelog != req.session.timelog){
      req.session.destroy();
      res.json({error:'Login out',redirect: '/director/login'});
  }
  if (!director) return res.json({success: true, redirect: '/director/login'});
  switch(action){
    case DirectorAction.init:
        return director.result(function(data){
            console.log('****************************');
            console.log('DirectorAction.init');
            if(!director.curCandidate) return ;
            var _res_data = {
                candidate: director.curCandidate,
                project: director.project,
                status: director.status,
                marks:filter_id(data.marks,'candidate',director.curCandidate._id)||null
            };
            if(director.marker){
                return res.json(_.extend(_res_data,{people:director.marker.marks.length}));
            }else{
                return res.json(_res_data);
            };
        });

    case DirectorAction.prev:
        console.log('****************************');
        console.log('DirectorAction.prev');
      return director.previous(function(err){
        if (err) return res.json({error: true});
          director.result(function(data){
              res.json({
                  candidate: director.curCandidate,
                  project: director.project,
                  status: director.status,
                  marks:filter_id(data.marks,'candidate',director.curCandidate._id)}
              );
          })
      });
    case DirectorAction.next:
        console.log('****************************');
        console.log('DirectorAction.next');
      return director.next(function(err){
        if (err) return res.json({error: true});
          director.result(function(data){
              res.json({
                  candidate: director.curCandidate,
                  project: director.project,
                  status: director.status,
                  marks:filter_id(data.marks,'candidate',director.curCandidate._id)
              });
          })
      });
    case DirectorAction.startVote:
      return director.startVote(function(err) {
        if (err) return res.json({error: true});
        else if(director.marker) director.marker.reset();
        res.send('vote-start');
      });
    case DirectorAction.endVote:
      var saveCallback = function(err){
        if(!err) {
          director.marker = null;
          VoteOperation.endVotedRequest(director);
          res.send('vote-end');
        }
      }
      var callback = function(err) {
        if (err) return res.json({error: true});
        else if(director.marker) {
          director.marker.isLocked = true;
          director.save(saveCallback);
        }
      }
      return director.endVote(callback);
    case DirectorAction.save:
      return director.save(function(err){
        if(!err) {
          director.marker = null;
          VoteOperation.syncVoted(director);
          res.send('save');
        }
      });
    case DirectorAction.result:
      return director.result(function(data){
        console.log('****************************');
        console.log('DirectorAction.result');
//        console.log(data);
        res.json(data);
      });
      case DirectorAction.query:
      console.log('****************************');
      console.log('DirectorAction.query');
      var voted = req.body['voted'];

      if (director.status != DirectorAction.startVote && director.status !=DirectorAction.process) VoteOperation.endVotedRequest(director);  //fix start_Vote
//          console.log('++++++++++++++++++++director.marker++++++++++');
//          console.log(director.marker);

      if (!director.marker) return director.operator = res;
//          console.log('vote,marks');
//          console.log(voted,director.marker.marks.length);

        if(voted == director.marker.marks.length){
            return director.operator = res;
        }else if(voted <= director.marker.marks.length){
            director.operator = res;
            return VoteOperation.syncVoted(director);
        }else{
            return VoteOperation.syncVoted(director);
        }

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
  if (!director) return res.json({success: true, redirect: '/director/login'});

  var destroyCallback = function(){
    res.json({success: true, redirect:'/director/login'});
  }

  var callback = function(err){
    if (!err) return req.session.destroy(destroyCallback);
    else return res.json({error:'Logout Error'});
  }

  projectMgr.unregister(director, callback);
}

VoteOperation.release = function(req, res){
  var project = req.body['project'];
  var director = getDirector(project);

  var callback = function(err){
    if (err) return res.json({error: 'Release not success'});
    else return res.json({feedback: 'Release success'});
  }

  projectMgr.unregister(director, callback);
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
  if (!req.session || !req.session.user) return res.json({error: true, redirect: '/login'});

  console.log('***************************');
  console.log('query');

  var status = req.body['status'];
  var candidate = req.body['candidate'];
  var projectId = req.body['projectId'];
  var director = projectMgr.getDirector({id: projectId});
  if (!director)  {
      req.session.destroy();
      return res.json({error: true, redirect: '/login'});
  };

  console.log('candidate: '+JSON.stringify(candidate));
  console.log('status: '+status);

  if (!candidate || !status  ) return res.json({status: director.status, candidate: director.curCandidate});

  try{
       if(candidate._id != director.curCandidate._id) return res.json({status: director.status, candidate: director.curCandidate});
  }catch(e){
    console.log(e);
  }
  console.log('director.status: '+director.status);
  console.log('director.curCandidate: '+director.curCandidate);

  if (director.status == status) {
    if (_.isObject(res.req.session.user)) {
      director.queue = _.reject(director.queue, function(record){
        return record.req.session.user.username == res.req.session.user.username;
      });
      director.queue.push(res);
      VoteOperation.syncVoted(director);
    };
  }else res.json({status: director.status, candidate: director.curCandidate});
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
  var projectId = req.body['projectId'];
  var director = projectMgr.getDirector({id: projectId});
  var user = req.session.user;

  if (!director) return res.json({error: true, redirect: '/home'});

  if (user && candidate && mark && director && director.marker) {
    mark.username = user.username;
    var callback = function(err){
      if (!err) res.json({success: true});
      else res.json({error: 'Push Error'});

      VoteOperation.syncVoted(director);
    }

    director.marker.collect({candidate: candidate, mark: mark}, callback);
  }else
    res.json({error: 'Param Error'});
}

VoteOperation.syncVoted = function(director){
    console.log('********syncVoted*****');
  if (director.operator) {
    var people = director.marker ? director.marker.marks.length: 0;
    var users = [];
    console.log(people);
    _.each(director.queue, function(res){
      var user = res.req.session.user;
      users.push({
        username: user.username,
        status: false
      });
    });

    if (people > 0) {
      _.each(director.marker.marks, function(record){
        _.each(users, function(user){
          if (user.username == record.username) {
            user.status = true;
          };
        });
      });
    };

    director.operator.json({voted: people, list: users});
    director.operator = null;
  };
}

VoteOperation.endVotedRequest = function(director){
  if (director.operator) {
    director.operator.json({close: true});
    director.operator = null;
  };
}