var Director = require('../models/director');
var StatusKeeper = require('../models/status-keeper.js');

var keeper = new StatusKeeper();
var director = new Director(keeper);

exports.init = function(req, res){
  if(req.session.project) 
    res.redirect('/director');
  else
    res.render('project-login');
}

exports.login = function(req, res){
  var id = req.body['id'];
  var key = req.body['key'];
  
  director.register({id:id, key: key}, function(err){
    if (err) return res.json({error:'Authentication failed, please check project id and key'});
    else {
      req.session.regenerate(function(){
        req.session.project = id;
        res.json({success:true, redirect:'/director'});
      });
    }
  });
}

exports.expo = function(req, res){
  res.render('project-expo');
}

exports.candidate = function(req, res){
  var action = req.body['action'];
  switch(action){
    case 'init':
      return res.json({candidate: director.candidate, project: director.project});
    case 'prev':
      return;
    case 'next':
      return;
    default:
      return res.json({error: 'Authentication Failed'});
  }
}
