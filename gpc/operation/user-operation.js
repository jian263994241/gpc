/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
var userCenter      = require('../models/user-center');
var UserExistError  = require('../models/error/user-exist-error');
var projectMgr      = require('../models/project-manager');

var UserOperation = exports = module.exports = {};

UserOperation.render = function(req, res){
  if (req.session) {
    if (req.session.project) {
      return res.redirect('/director');
    }else if(req.session.admin){
      return res.redirect('/management');
    }
  };

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

UserOperation.register = function(req, res){

  var username = req.body['username'];
  var password = req.body['password'];
  var email    = req.body['email'];

  userCenter.register(username, password, email, function(err, user){
    if (err instanceof UserExistError){
      res.json({error:'Username has been already occupied. Please change username'});
    }else if(err instanceof Error){
      res.json({error:'Register Error'});
    }else if(user){
      req.session.regenerate(function(){
        req.session.user = user;
        res.json({success:true, redirect:'home'});
      });
    }
  });
}

UserOperation.login = function(req, res){

  var username = req.body['username'];
  var password = req.body['password'];

  userCenter.login(username, password, function(err, user){
    if (user) {
      req.session.regenerate(function(){
        req.session.user = user;

        // ajax post is able to process redirect
        // res.redirect('/home ');
        res.json({success:true, redirect:'home'});
      });
    }else{
      req.session.user = null;
      res.json({error:'Authentication failed, please check username and password'});
    }
  });
}

UserOperation.logout = function(req, res){
  req.session.destroy(function(){
    res.json({success: true, redirect:'/'});
  });
}