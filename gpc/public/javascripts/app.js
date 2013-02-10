angular.module('lb-gpc', []).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider.
      when('/', {templateUrl: 'template/login.html', controller: UserLoginCtrl}).
      when('/login',  {redirectTo: '/'}).
      when('/register', {templateUrl: 'template/register.html', controller: UserRegisterCtrl}).
      when('/home', {templateUrl: 'template/home.html', controller: UserHomeCtrl}).
      when('/management', {templateUrl: 'template/login.html', controller: ManageLoginCtrl}).
      when('/management/project', {templateUrl: 'template/manage-project.html', controller: ManageProjectCtrl}).
      otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);