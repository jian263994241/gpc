angular.module('lb-gpc', []).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider.
      when('/', {templateUrl: '/template/login.html', controller: UserLoginCtrl}).
      when('/login',  {redirectTo: '/'}).
      when('/register', {templateUrl: '/template/register.html', controller: UserRegisterCtrl}).
      when('/home', {templateUrl: '/template/home.html', controller: UserHomeCtrl}).
      when('/management', {templateUrl: '/template/login.html', controller: ManageLoginCtrl}).
      when('/management/project', {templateUrl: '/template/manage-project.html', controller: ManageProjectCtrl}).
      when('/management/project/candidates/:projectId', {templateUrl: '/template/manage-project-candidates.html', controller:ManageProjectCandidatesCtrl}).
      when('/management/candidate', {templateUrl: '/template/manage-candidate.html', controller: ManageCandidateCtrl}).
      when('/management/user', {templateUrl: '/template/manage-user.html', controller: ManageUserCtrl}).
      when('/director', {templateUrl: '/template/director.html', controller: DirectorCtrl}).
      when('/director/login', {templateUrl: '/template/login.html', controller: DirectorLoginCtrl}).
      when('/director/result/:projectId', {templateUrl: '/template/result.html', controller: DirectorResultCtrl}).
      when('/director/vote/:projectId', {templateUrl: '/template/vote.html', controller: VoteCtrl}).
      otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);