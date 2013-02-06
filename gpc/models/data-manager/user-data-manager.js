/**
 * @author Michael.Lee(leewind19841209@gamil.com)
 * @version Beta 1.1
 */

var dataMgr = require('./data-manager');

var UserDataManager = exports = module.exports = {};
UserDataManager.key = dataMgr.COLLECTION_USER;

/**
 * Query all users from GPC_DB.users
 *
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
UserDataManager.queryAllUsers = function(fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(UserDataManager.key, function(err, collection){
      collection.find().toArray(function(err, data){
        if(!err)fn(err, data.concat());
        else fn(err);
        mongoServer.close();
      });
    });
  });
}

/**
 * Query specified user from GPC_DB.users
 *
 * @param {JSON} user data object
 * @param {Function} callback function(err, data){}
 *
 * @api public
 */
UserDataManager.queryUser = function(user, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(UserDataManager.key, function(err, collection){
      collection.find(user).toArray(function(err, data){
        if(!err)fn(err, data.concat());
        else fn(err);
        mongoServer.close();
      });
    });
  });
}

UserDataManager.render = function(res){
  return res.render('users', {
    project_status: '',
    candidate_status: '',
    user_status:'active',
    modal_id: 'user-modal',
    modal_type: 'New User',
  });
}

UserDataManager.query = function(user, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(UserDataManager.key, function(err, collection){
      collection.find(user).toArray(function(err, data){
        if(!err)fn(err, data.concat());
        else fn(err);
        mongoServer.close();
      });
    });
  });
}

/**
 * Insert user into GPC_DB.users
 *
 * @param {JSON} user data object
 * @param {Function} callback function(err, records){}
 *
 * @api public
 */
UserDataManager.addUser = function(user, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(UserDataManager.key, function(err, collection){
      collection.find(user).toArray(function(err, data){
        if (err) {
          fn(err);
          mongoServer.close();
        }else if(data.length > 0){
          fn(new Error('Data Exist'));
          mongoServer.close();
        }else{
          collection.insert(user, {safe: true}, function(err, records){
            fn(err, records);
            mongoServer.close();
          });
        }
      });
    });
  });
}

/**
 * Remove user from GPC_DB.users
 *
 * @param {JSON} user data object
 * @param {Function} callback function(err){}
 *
 * @api public
 */
UserDataManager.removeUser = function(user, fn){
  var mongoServer = dataMgr.createDbServer();
  var dbConnector = dataMgr.createDbConnector(mongoServer);

  dbConnector.open(function(err, db){
    db.collection(UserDataManager.key, function(err, collection){
      collection.remove(user, false, function(err){
        fn(err);
        mongoServer.close();
      });
    });
  });
}