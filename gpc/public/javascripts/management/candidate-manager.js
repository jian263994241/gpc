function CandidateManageCtrl ($scope, $http, $window) {
  $scope.candidates = new Array();

  $scope.init = function(){
    $http.post('/management/candidate/all').
    success(function(data, status, headers, config){
      console.log(data);
      if (!data.error) $scope.candidates = data.records;
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.save = function(){
    $http.post('/management/candidate/add', {candidate: $scope.candidate}).
    success(function(data, status, headers, config){
      console.log(data);
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
    $http.post('/management/candidate/remove', {candidate: candidate}).
    success(function(data, status, headers, config){
      console.log(data);
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