angular.module('ngView', [], function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
});

function CandidateManageCtrl ($scope, $http, $location, $window) {
  $scope.isCreate = false;
  $scope.candidates = new Array();
  $scope.project = null;

  $scope.init = function(){
    $scope.project = $location.search();
    if (!$scope.project) return alert('error');

    $http.post('/management/candidate/all', $scope.project).
    success(function(data, status, headers, config){
      console.log(data);
      if (!data.error) $scope.candidates = data.candidates;
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.save = function(){
    $http.post('/management/candidate/add', {candidate: {project: $scope.project.project, data: $scope.candidate}}).
    success(function(data, status, headers, config){
      console.log(data);
      if (data.success) {
        $scope.isCreate = false;
        $scope.refresh();
      }else{
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.delete = function(candidate){
    console.log('candidate');
    console.log(candidate);
    $http.post('/management/candidate/remove', {candidate:{project: candidate.project, data:candidate.data}}).
    success(function(data, status, headers, config){
      if (data.success) {
        $scope.refresh();
      }else{
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.create = function(){
    $scope.isCreate = true;
  }

  $scope.close = function(){
    $scope.isCreate = false;
  }

  $scope.refresh = function(){
    $window.location.reload();
  }
}

