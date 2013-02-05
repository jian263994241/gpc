function CandidateManageCtrl ($scope, $http, $window) {
  $scope.candidates = new Array();
  $scope.all = new Array();

  $scope.init = function(){

    var domProjectId = document.querySelector('#project-id');
    var projectId = domProjectId.getAttribute('data-project-id');

    $http.post('/management/candidate/all').
    success(function(data, status, headers, config){
      if (!data.error) $scope.all = data.candidates;
    }).
    error(function(data, status, headers, config){

    });

    $http.post('/management/project/candidates/all', {project: {id: projectId}}).
    success(function(data, status, headers, config){
      if (!data.error) $scope.candidates = data.candidates;
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.add = function(){
    var candidateId = $('#candidate-selection').find("option:selected").val();
    var projectId = $('#project-id').attr('data-project-id');

    $http.post('/management/project/candidates/add', {candidate: {_id: candidateId}, project:{id: projectId}}).
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

  $scope.delete = function(candidate){
    var projectId = $('#project-id').attr('data-project-id');

    $http.post('/management/project/candidates/remove', {candidate: {_id: candidate._id}, project:{id: projectId}}).
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

  $scope.refresh = function(){
    $window.location.reload();
  }
}