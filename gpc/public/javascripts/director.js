function DirectorCtrl ($scope, $http, $timeout) {
  $scope.candidate = null;
  $scope.isStart = false;

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
    $scope.isStart = true;
    $http.get('start').
    success(function(data, status, headers, config){
      console.log('start');

      $scope.time = 0;
      $timeout($scope.timer, 1000);
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.end = function(){
    $scope.isStart = false;
    $http.get('end').
    success(function(data, status, headers, config){
      console.log('end');
    }).
    error(function(data, status, headers, config){

    });
  }

   $scope.timer = function(){
    if ($scope.isStart == false) return;
    $scope.time ++;
    $timeout($scope.timer, 1000);
  }

}