const DATABASE_NAME = 'GPC_DB';
const COLLETION_USER = 'users';
const COLLETION_CANDIDATE = 'candidates';
const COLLETION_PROJECT = 'projects';
const COLLETION_MARK = 'marks';

var mongojs = require('mongojs');

var tables = mongojs(DATABASE_NAME, [COLLETION_USER, COLLETION_CANDIDATE, COLLETION_PROJECT, COLLETION_MARK]);

exports = module.exports = {
  user: tables.COLLETION_USER,
  project: tables.COLLETION_PROJECT,
  candidate: tables.COLLETION_CANDIDATE,
  mark: tables.COLLETION_MARK
}