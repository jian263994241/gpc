angular.module('ngView', [], function($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
});

function ResultCtrl ($scope, $http, $location, $window) {

  $scope.candidates = new Array();
  $scope.project = null;
  $scope.candidate = null;
  $scope.marks = new Array();

  $scope.init = function(){
    $scope.project = $location.search();
    if (!$scope.project) return alert('error');

    $http.post('/management/candidate/all', $scope.project).
    success(function(data, status, headers, config){
      console.log(data);
      if (!data.error){
        $scope.candidates = data.candidates;
        $scope.setCandidate($scope.candidates[0]);
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.setCandidate =function(candidate){
    $scope.marks = new Array();
    $scope.candidate = candidate;
    $scope.marks = $scope.candidate.marks;
    console.log($scope.marks);
  }

  $scope.goBack = function(){
    $window.location.href = '/director';
  }
}