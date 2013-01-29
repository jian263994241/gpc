function VoteCtrl($scope, $http, $timeout){
  $scope.status = null;
  $scope.candidate = null;
  $scope.isStart = false;
  $scope.isForbidden = false;

  $scope.request = function(){
    $http.post('/director/status', {status: $scope.status, candidate: $scope.candidate}, {timeout: 9999999999}).
    success(function(data, status, headers, config){
      console.log(data);

      var res =data;
      if (data.error) return;

      $scope.status = res.status;
      switch(res.status){
        case 'show':
          $scope.candidate = res.candidate;
          $scope.isStart = false;
          $scope.isForbidden = false;
          break;
        case 'process':
          $scope.isStart = true;
          $scope.isForbidden = false;
          break;
        case 'end':
          $scope.isStart = false;
          $scope.isForbidden = true;
        default:
          break;
      }

      setTimeout($scope.request, 1000);
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.submit = function(){
    $http.post('/director/vote', {candidate: $scope.candidate, mark: $scope.mark}).
    success(function(data, status, headers, config){
      console.log(data);
      if (data.success) {
        $scope.isStart = false;
        $scope.isForbidden = true;
      };
    }).
    error(function(data, status, headers, config){

    });
  }

}