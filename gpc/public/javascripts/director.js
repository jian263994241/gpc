function DirectorCtrl ($scope, $http) {
  $scope.candidate = null;

  $scope.init = function(){
    if (!$scope.candidate) {
      $scope.request('init');
    };
  }

  $scope.request = function(action){
    $http.post('candidate', {action: action}).
    success(function(data, status, headers, config){
      console.log(data);
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.init();

}