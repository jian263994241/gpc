function NoUserError() {
  var error = new Error('user not exist');
}

function InvalidPasswordError(){
  var error = new Error('invalid password');
}

function UserExistError(){
  var error = new Error('user already existed');
}

exports.NoUserError = NoUserError;
exports.InvalidPasswordError = InvalidPasswordError;
exports.UserExistError = UserExistError;