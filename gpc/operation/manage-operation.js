var _ = require('underscore');

var projectDataMgr = require('../models/data-manager/project-data-manager');
var candidateDataMgr = require('../models/data-manager/project-data-manager');

var ManageOperation = exports = module.exports = {};

/**
 * Process client submitted data
 *
 * @param{Request}
 * @param{Response}
 * @param{String} keyword for submitted data
 * @param{Function} callback function(data){}
 *
 * @api private
 */
function process(req, res, key, fn){
  var data = req.body[key];
  if (data) {
    fn(data);
  }else{
    res.json({error: 'Lost submitted data'});
  }
}

/**
 * Render 'management-projects' view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.setProjectList = function(req, res){
  res.render('management-projects');
}

/**
 * Query all projects data and response json data
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.queryAllProjects = function(req, res){
  projectDataMgr.queryAllProjects(function(err, records){
    if (!err && records) res.json({projects: records});
    else res.json({error: true});
  });
}

/**
 * Add project and response operation status
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.addProject = function(req, res){
  process(req, res, 'project', function(project){
    projectDataMgr.addProject(project, function(err){
      if (err)  res.json({error: 'Add project failed'});
      else  res.json({success: true});
    });
  });
}

/**
 * Remove project and response operation status
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.removeProject = function(req, res){
  process(req, res, 'project', function(project){
    projectDataMgr.removeProject(project, function(err){
      if (err)  res.json({error: 'Remove project failed'});
      else  res.json({success: true});
    });
  });
}

/**
 * Query specified candidate data
 *
 * @param{String} candidate record _id
 * @param{Function} callback function(data){}
 *
 * @api private
 */
function queryCandiate(candidateId, fn) {
  candidateDataMgr.queryCandiate({_id: candidateId}, fn);
}

/**
 * Render 'management-candidates' view
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.setCandidates = function(req, res){
  res.render('management-candidates');
}

/**
 * Query all candidates data and response json data
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.queryAllCandidates = function(req, res){
  candidateDataMgr.queryAllCandidates(function(err, records){
    if (!err && records) res.json({candidates: records});
    else res.json({error: true});
  });
}

/**
 * Add candidate and response operation status
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.addCandidate = function(req, res) {
  process(req, res, 'candidate', function(candidate){
    candidateDataMgr.addCandidate(candidate, function(err){
      if (err)  res.json({error: 'Add candidate failed'});
      else  res.json({success: true});
    });
  });
}

/**
 * Remove candidate and response operation status
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.removeCandidate = function(req, res){
  process(req, res, 'candidate', function(candidate){
    candidateDataMgr.removeCandidate(candidate, function(err){
      if (err)  res.json({error: 'Remove candidate failed'});
      else  res.json({success: true});
    });
  });
}

/**
 * Query candidates in project
 *
 * @param{Request}
 * @param{Response}
 *
 * @api public
 */
ManageOperation.queryProjectCandidates = function(req, res){
  process(req, res, 'project', function(project){
    projectDataMgr.queryProject(project, function(err, records){
      if (!err && records) {
        var candidateArr = records[0].candidates;
        var sen = new Array();
        _.each(candidateArr, function(el, index, list){
          sen.push({_id: el});
        });

        sen = sen.toString();
        sen = '$or:'+sen;

        candidateDataMgr.queryCandiate({sen}, function(err, records){
          if (!err && records) res.json({candidates: records});
          else res.json({error: true});
        });
      };
    });
  });
}

ManageOperation.removeCandidateFromProject = function(req, res){

}

ManageOperation.insertCandidateIntoProject = function(req, res){

}