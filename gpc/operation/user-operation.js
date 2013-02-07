/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */
var userCenter      = require('../models/user-center');
var UserExistError  = require('../models/error/user-exist-error');
var projectMgr      = require('../models/project-manager');

var UserOperation = exports = module.exports = {};

UserOperation.renderHomeView = function(req, res){
  if (userCenter.isLogin(req.session.user)) {
    res.render('home', {username: req.session.user.username, logout_url: 'logout', directors: projectMgr.accessQueue});
  }else{
    res.redirect('/login');
  }
}

UserOperation.renderLoginView = function(req, res){
  if (userCenter.isLogin(req.session.user)) res.redirect('/home');
  else  res.render('login', {
    js_control_file: 'client-login',
    is_need: true,
    login_title: 'User Login',
    guide_link: '/register',
    guide_link_title: 'Register',
    username_title: 'Username',
    password_title: 'Password',
    submit_button_title: 'Sign in',
    is_need_remember: true
  });
}

UserOperation.renderRegisterView = function(req, res){
  if (userCenter.isLogin(req.session.user)) res.redirect('/home');
  else  res.render('register', {link_login: '/login'});
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
    res.redirect('/login');
  });
}