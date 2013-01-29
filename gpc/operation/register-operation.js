var userCenter = require('../models/user-center');
var customError = require('../models/custom-error');

var RegisterOperation = RegisterOperation || {};

RegisterOperation.register = function(req, res){
  if (userCenter.isLogin(req.session.user)) res.redirect('/home');
  else  res.render('register', {link_login: '/login'});
}

RegisterOperation.registerSubmit = function(req, res){

  var username = req.body['username'];
  var password = req.body['password'];
  var email    = req.body['email'];

  userCenter.register(username, password, email, function(err, user){
    if (err instanceof customError.UserExistError){
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

exports.userRegister = RegisterOperation.register;
exports.userRegisterSubmit = RegisterOperation.registerSubmit;