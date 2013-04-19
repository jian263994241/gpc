/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

// Declare required lib
var path            = require("path");
var fs              = require("fs");
var ccap            = require("ccap");
var _               = require('underscore');
var userCenter      = require('../models/user-center');
var UserExistError  = require('../models/error/user-exist-error');

var UserOperation = exports = module.exports = {};

UserOperation.resetQueue = [];

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
    case '/forgot':

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

UserOperation.requestVerifiedCode = function(req, res){
  var id = req.params.id;

  if (id && id.length == 8) {
    var captcha = ccap({
      width: 125,
      height: 30
    });
    var codes = captcha.get();
    UserOperation.resetQueue = _.reject(UserOperation.resetQueue, function(item){ return item.id == id; });
    UserOperation.resetQueue.push({ id: id, code: codes[0] });
    return res.send(codes[1]);
  }else{
    return res.send();
  }
  
}

/**
 * [POST] Request user password reset link
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
UserOperation.requestResetPassword = function(req, res){
  var id = req.body['id'];
  var email = req.body['email'];
  if (!email) return res.json({error: 'Empty email'});
  if (!id || id.length != 8) return res.json({error: 'Error id'});

  var filename = path.resolve(__dirname, '../conf.json');
  path.exists(filename, function(exists){
    if (exists) {
      var queryCallback = function(err){
        if (err) return res.json({'error': 'No such user'});
        else return res.json({'success': 'Send reset link to your email, please check!'});
      }

      var readFileCallback = function(err, file) {    
        if (!err) {
          var conf = JSON.parse(file);
          userCenter.getResetLink(email, conf, queryCallback);
        }else {
          console.error(err.stack);
          return res.json({'error': 'email server not work temp'});
        }
      }
      
      fs.readFile(filename, "binary", readFileCallback);
    };
  });
}

/**
 * [POST] Reset user password
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
UserOperation.reset = function(req, res){

  console.log('***********************************');
  console.log('UserOperation.reset');

  var id = req.params.id;
  var password = req.body['password'];

  if (!id || !password) return res.json({'error': 'Invalid request parameters!'});

  var callback = function(err){
    if (err) return res.json({'error': 'Fail to reset the password'});
    else return res.json({'redirect': '/login', 'success': true});
  }

  userCenter.reset(id, password, callback);
}