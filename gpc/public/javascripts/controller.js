var MainCntl = function($scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
}

var login = function($scope, api){
  $scope.isError = false;
  $scope.error = '';

  $scope.submit = function(user){
    if (user && user.username && user.password) {
      $scope.$http.post(api, user).
      success(function(data, status, headers, config){
        if (data.error) {
          $scope.error = data.error;
          $scope.isError = true;
        }else if(data.success && data.redirect){
          $scope.$location.url(data.redirect);
        }
      }).
      error(function(data, status, headers, config){

      });
    }else{
      $scope.error = 'Please input your username and password';
      $scope.isError = true;
    }
  };

  $scope.clean = function(){
    $scope.isError = false;
    $scope.error = '';
  }
}

var util = {
  checkEmailInput: function(email){
    return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email);
  }
}

var UserLoginCtrl = function($scope, $location, $http){
  $scope.$location = $location;
  $scope.$http = $http;

  $scope.config = {
    isNeed : true,
    link: '/register',
    entry: 'Register',
    title: 'User Login',
    account: 'Username',
    key: 'Password',
    isRemember: true,
    button: 'Sign in'
  }

  login($scope, 'login');
}

var UserRegisterCtrl = function($scope, $location, $http){
  $scope.$location = $location;

  $scope.isError = false;
  $scope.error = '';

  $scope.submit = function(user){

    if (user && user.username && user.password && user.email) {

      if (user.password != user.repassword) {
        $scope.error = 'Please confirm the repeated password';
        $scope.isError = true;
        return;
      };

      if (!util.checkEmailInput(user.email)) {
        $scope.error = 'Email format error';
        $scope.isError = true;
        return;
      };

      $http.post('/register', user).
      success(function(data, status, headers, config){
        if (data.error) {
          $scope.error = data.error;
          $scope.isError = true;
        }else if(data.success && data.redirect){
          $scope.$location.url(data.redirect);
        }
      }).
      error(function(data, status, headers, config){

      });

    }else{
      $scope.error = 'Please input the information completely';
      $scope.isError = true;
      return;
    }
  };

  $scope.clean = function(){
    $scope.isError = false;
    $scope.error = '';
  }
}

var UserHomeCtrl = function(){

}

var ManageLoginCtrl = function($scope, $location, $http){
  $scope.$location = $location;
  $scope.$http = $http;

  $scope.config = {
    isNeed : false,
    link: '/#',
    entry: '#',
    title: 'Management Login',
    account: 'Admin',
    key: 'Access Key',
    isRemember: false,
    button: 'Sign in'
  }

  login($scope, 'management/login');
}

var ManageProjectCtrl = function($scope, $route, $location, $http){
  $scope.$location = $location;
  $scope.$http = $http;
  $scope.$route = $route;

  $scope.projects = new Array();

  $scope.init = function(){
    $http.post('/management/project/all').
    success(function(data, status, headers, config){
      if (!data.error) $scope.projects = data.records;
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.save = function(){
    $http.post('/management/project/add', {project: $scope.project}).
    success(function(data, status, headers, config){
      if (data.success) {
        $('#project-modal').modal('hide')
        $scope.$route.reload();
      }else{
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.delete = function(project){
    $http.post('/management/project/remove', {project:{id:project.id, name:project.name, key:project.key}}).
    success(function(data, status, headers, config){
      if (data.success) {
        $scope.$route.reload();
      }else{
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }
}