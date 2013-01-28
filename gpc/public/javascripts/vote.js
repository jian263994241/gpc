function VoteCtrl($scope, $http, $timeout){
  $scope.status = null;
  $scope.candidate = null;
  $scope.isVote = false;

  $scope.request = function(){
    $http.post('status', {status: $scope.status, candidate: $scope.candidate}, {timeout: 9999999999}).
    success(function(data, status, headers, config){
      console.log(data);

      var res =data;
      if (data.error) return;

      $scope.status = res.status;
      switch(res.status){
        case 'show':
          $scope.candidate = res.candidate;
          break;
        case 'process':
          $scope.time = 30;
          $scope.isVote = true;
          $timeout($scope.timer, 1000);
          break;
        default:
          break;
      }

      setTimeout($scope.request, 1000);
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.timer = function(){
    if ($scope.time < 1) {
      $scope.isVote = false;
      return;
    };

    $scope.time = $scope.time - 1;
    $timeout($scope.timer, 1000);
  }
}