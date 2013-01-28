var Director = require('../models/director');
var StatusKeeper = require('../models/status-keeper.js');

var waitQueue = new Array();

var keeper = new StatusKeeper(function(){
  while(res = waitQueue.shift()){
    res.json({status: director.status, candidate: director.candidate});
  }
});
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
  if (req.session.project) {
    res.render('project-expo');
  }else{
    res.redirect('/project-login');
  }
  
}

exports.candidate = function(req, res){
  var action = req.body['action'];
  switch(action){
    case 'init':
      return res.json({candidate: director.candidate, project: director.project});
    case 'prev':
      return director.previous(function(err){
        if (err) return res.json({error: true});
        res.json({candidate: director.candidate, project: director.project});
      });
    case 'next':
      return director.next(function(err){
        if (err) return res.json({error: true});
        res.json({candidate: director.candidate, project: director.project});
      });
    default:
      return res.json({error: 'Authentication Failed'});
  }
}

exports.start = function(req, res){
  director.vote(function () {
    console.log('end voting');
  })
}


/*************************************************************/
/*********************Client Event****************************/
exports.vote = function(req, res){
  res.render('vote');
}

exports.status = function(req, res){

  var status = req.body['status'];
  var candidate = req.body['candidate'];

  // init status
  if (!candidate && !status) return res.json({status: director.status, candidate: director.candidate});

  if (director.status == status && director.candidate.index == candidate.index) {
    // add into wait queue
    waitQueue.push(res);
  }else{
    res.json({status: director.status, candidate: director.candidate});
  }
}
