var userCenter = require('../models/user-center');

exports.init = function(req, res){
  if (userCenter.isLogin(req.session.user)) res.redirect('/home');
  else  res.render('login', {link_register: '/register'});
}

exports.login = function(req, res){

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

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/login');
  });
}

exports.check = function(req, res){
  if (userCenter.isLogin(req.session.user)) {
    res.render('home', {username: req.session.user.username, logout_url: 'logout'});
  }else{
    res.redirect('/login');
  }
  
}