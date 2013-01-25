var userCenter = require('../models/director');

exports.director = function(req, res){
  if(req.session.project) 
    console.log('redirect');
  else
    res.render('director');

  // if (req.session.project) res.redirect('/director#/project/'+req.session.project);
  // res.render('director');
  // res.redirect('/director#/project/'+2);
}

exports.registerProject = function(req, res){

}
