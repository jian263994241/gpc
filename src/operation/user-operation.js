/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

 // Declare required lib
var userCenter      = require('../models/user-center');
var UserExistError  = require('../models/error/user-exist-error');
var projectMgr      = require('../models/project-manager');

var UserOperation = exports = module.exports = {};

/**
 * [GET] User Login/Register/Logout view controller
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
UserOperation.render = function(req, res){
  if (req.session)
    if (req.session.project) return res.redirect('/director');
    else if(req.session.admin) return res.redirect('/management');

  switch(req.route.path){
    case '/':
    case '/login':
      if (userCenter.isLogin(req.session.user)) return res.redirect('/home');
      else return res.render('main');
    case '/home':
      if (userCenter.isLogin(req.session.user)) return res.render('main');
      else return res.redirect('/login');
    default:
      return res.render('main');
  }
}

/**
 * [POST] User register 
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
UserOperation.register = function(req, res){

  var username = req.body['username'];
  var password = req.body['password'];
  var email    = req.body['email'];

  var callback = function(err, user){
    if (err && err instanceof UserExistError){
      console.error(err.stack);
      res.json({error:'Username has been already occupied. Please change username'});
    }else if(err){
      console.error(err.stack);
      res.json({error:'Register Error'});
    }else if(!err && user){
      var regenerateCallback = function(){
        req.session.user = user;
        res.json({success:true, redirect:'home'});
      }
      req.session.regenerate(regenerateCallback);
    }
  }

  userCenter.register(username, password, email, callback);
}

/**
 * [POST] User login 
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
UserOperation.login = function(req, res){
  var username = req.body['username'];
  var password = req.body['password'];

  var callback = function(err, user){
    if (!err && user) {
      var regenerateCallback = function(){
        req.session.user = user;

        // ajax post is able to process redirect
        // res.redirect('/home ');
        res.json({success:true, redirect:'home'});
      }
      req.session.regenerate(regenerateCallback);
    }else{
      if(err) console.error(err.stack);
      req.session.user = null;
      res.json({error:'Authentication failed, please check username and password'});
    }
  }

  userCenter.login(username, password, callback);
}

/**
 * [GET] User logout 
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
UserOperation.logout = function(req, res){
  req.session.destroy(function(){
    res.json({success: true, redirect:'/'});
  });
}