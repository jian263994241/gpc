var mongojs = require('mongojs');

var databaseName = 'GPC_DB';
var table_user = 'users';
var table_candidate = 'candidates';

var tables = mongojs(databaseName, [table_user, table_candidate]);

exports.table = tables;
