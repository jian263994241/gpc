var mongojs = require('mongojs');

var databaseName = 'GPC_DB';
var table_user = 'users';
var table_candidate = 'candidates';
var table_project = 'projects';

var tables = mongojs(databaseName, [table_user, table_candidate, table_project]);

exports.table = tables;
