function DirectorCtrl ($scope, $http, $timeout, $window) {
  $scope.candidate = null;
  $scope.isStart = false;
  $scope.isEnd = false;
  $scope.qrcode = 'http://chart.apis.google.com/chart?chs=200x200&cht=qr&chl='+$window.location.host+'&choe=UTF-8&chld=Q|2'

  $scope.setCandidate = function(data){
    $scope.project = data.project;
    $scope.candidate = data.candidate.data;
    
    if ($scope.candidate && $scope.candidate.type == 'image') $scope.isImage = true;
    else $scope.isImage = false;

    if($scope.candidate && $scope.candidate.type == 'video') $scope.isVideo = true;
    else $scope.isVideo = false;
  }

  $scope.timer = function(){
    if ($scope.isStart == false) return;
    $scope.time ++;
    $timeout($scope.timer, 1000);
  }

  $scope.request = function(action){
    $http.post('/director/exec', {action: action}).
    success(function(data, status, headers, config){
      console.log(data);
      if (data.error) return;

      switch(action){
        case 'init':
        case 'prev':
        case 'next':
        case 'save':
          $scope.isEnd = false;
          return $scope.setCandidate(data);
        case 'start_vote':
          $scope.isStart = true;
          $scope.time = 0;
          $timeout($scope.timer, 1000);
          $scope.isEnd = false;
          return;
        case 'end_vote':
          $scope.isStart = false;
          $scope.isEnd = true;
          return;
        default:
          return;
      }
    }).
    error(function(data, status, headers, config){

    });
  }

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

  $scope.start = function(){
    $scope.request('start_vote');
  }

  $scope.end = function(){
    $scope.request('end_vote');
  }

  $scope.save = function(){
    $scope.request('save');
  }

  $scope.showResult = function(){
    console.log($scope.project);
    if ($scope.project) {
      $window.location.href = '/director/result?project='+$scope.project.id;
    };
  }
}