
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.redirect('/login');
}

exports.vote = function(req, res){
  res.render('vote');
}
