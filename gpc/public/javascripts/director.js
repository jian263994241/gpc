function DirectorCtrl ($scope, $http) {
  $scope.candidate = null;

  $scope.init = function(){
    if (!$scope.candidate) {
      $scope.request('init');
    };
  }

  $scope.next = function(){
    $scope.request('next');
  }

  $scope.prev = function(){
    $scope.request('prev');
  }

  $scope.request = function(action){
    $http.post('candidate', {action: action}).
    success(function(data, status, headers, config){
      if (data.error) return;
      $scope.project = data.project;
      $scope.candidate = data.candidate.data;
      
      if ($scope.candidate.type == 'image') $scope.isImage = true;
      else $scope.isImage = false;

      if($scope.candidate.type == 'video') $scope.isVideo = true;
      else $scope.isVideo = false;
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.start = function(){
    $http.get('start').
    success(function(data, status, headers, config){
      console.log('start');
    }).
    error(function(data, status, headers, config){

    });
  }

  // $scope.init();

}