var userCenter = require('../models/user-center');
var projectMgr = require('../models/project-manager');

var LoginOperation = LoginOperation || {};

LoginOperation.login = function(req, res){
  if (userCenter.isLogin(req.session.user)) res.redirect('/home');
  else  res.render('login', {link_register: '/register'});
}

LoginOperation.loginSubmit = function(req, res){

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

LoginOperation.logoutSubmit = function(req, res){
  req.session.destroy(function(){
    res.redirect('/login');
  });
}

LoginOperation.search = function(req, res){
  if (userCenter.isLogin(req.session.user)) {
    res.render('home', {username: req.session.user.username, logout_url: 'logout', directors: projectMgr.accessQueue});
  }else{
    res.redirect('/login');
  }
}

exports.userLogin = LoginOperation.login;
exports.userLoginSubmit = LoginOperation.loginSubmit;
exports.userLogoutSubmit = LoginOperation.logoutSubmit;
exports.searchProject = LoginOperation.search; 