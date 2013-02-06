/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */


/**
 * Include crypto module
 *
 * @see express/example/auth
 * @see https://github.com/visionmedia/node-pwd
 */
var crypto = require('crypto');

// Bytesize
var len = 128;

// Iterations. ~300ms
var iterations = 12000;

var userDataMgr = require('./data-manager/user-data-manager');

var UserExistError = require('./error/user-exist-error');
var InvalidPasswordError = require('./error/invalid-password-error');
var NoUserError =require('./error/no-user-error');

// declare namespace UserCenter
var UserCenter = exports = module.exports = {};

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} password to hash
 * @param {String} optional salt
 * @param {Function} callback
 * @api private
 */
UserCenter.hash = function (pwd, salt, fn) {
  if (3 == arguments.length) {
    crypto.pbkdf2(pwd, salt, iterations, len, fn);
  } else {
    fn = salt;
    crypto.randomBytes(len, function(err, salt){
      if (err) return fn(err);
      salt = salt.toString('base64');
      crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash){
        if (err) return fn(err);
        fn(null, salt, hash);
      });
    });
  }
}

/**
 * Auth user login or register. Crypto password and generate
 * pass and salt.
 *
 * @param {String} user input password
 * @param {String} pass query from database
 * @param {String} salt query from database
 * @param {Function} callback fn(err, success)
 * @api private
 */
UserCenter.authenticate = function(input, pass, salt, fn){
  UserCenter.hash(input, salt, function(err, hash){
    if (err) return fn(err);
    if (pass == hash) return fn(null, true);

    return fn(new InvalidPasswordError());
  });
}

/**
 * User login
 *
 * @param {String} username
 * @param {String} password
 * @param {Function} callback fn(err, user)
 * @api public
 */
UserCenter.login = function(username, password, fn){
  userDataMgr.query({username:username}, function(err, data){

    if (err) return fn(err);
    var user = data[0];
    if (user) {
      UserCenter.authenticate(password, user.password, user.salt, function(err, success){
        if (err) return fn(err);
        if (success) {
          return fn(null, {username:username, password:user.password, salt:user.salt});
        }
      });
    }else{
      return fn(new NoUserError());
    }
  });
}

/**
 * check whether user login info has been kept
 *
 * @param {JSON} {username, password, salt}
 * @api public
 */
UserCenter.isLogin = function(user){
  if (user && user.username && user.password && user.salt) return true;
  else return false;
}

/**
 * 
 * User register
 *
 * @param {String} username
 * @param {String} password
 * @param {String} email
 * @param {Function} callback fn(err)
 * @api public
 */
UserCenter.register = function(username, password, email, fn){
   userDataMgr.query({username:username}, function(err, data){
    if (err) return fn(err);
    var user = data[0];
    if (!user) {
      UserCenter.hash(password, function(err, salt, hash){
        if (err) return fn(err);
        userDataMgr.add({username: username, password: hash, salt: salt, email: email}, function(err){
          fn(err, {username: username, password: hash, salt: salt});
        });
      });
    }else{
      return fn(new UserExistError());
    }
  });
}