var dataMgr = require('./data-manager');

var UserDataManager = UserDataManager || {};
UserDataManager.db = dataMgr.table.users;

/**
 * query user by username from database
 * 
 * @param {String} username
 * @param {Function} callback fn(err, docs)
 * @api public
 */
UserDataManager.queryUser = function(name, fn){
  UserDataManager.db.find({username: name}, fn);
}

/*
 * insert user into database
 *
 * @param {JSON} {username, pass, salt, email}
 * @param {Function} callback fn(err)
 * @api public
 */
UserDataManager.addUser = function(user, fn){
  if(user) UserDataManager.db.save(user, fn);
}

exports.queryUser = UserDataManager.queryUser;
exports.addUser = UserDataManager.addUser;