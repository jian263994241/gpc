function DirectorCtrl ($scope, $http, $timeout, $window) {
  $scope.candidate = null;
  $scope.isStart = false;
  $scope.isEnd = false;
  $scope.qrcode = 'http://chart.apis.google.com/chart?chs=200x200&cht=qr&chl='+$window.location.host+'&choe=UTF-8&chld=Q|2'
  $scope.lock = false;

  $scope.setCandidate = function(data){
    $scope.project = data.project;
    $scope.candidate = data.candidate;
    
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
      if (data.error) return;
      switch(action){
        case 'init':
        case 'prev':
        case 'next':
          if (data.status == 'end') $scope.isEnd = true;
          else $scope.isEnd = false;
          $scope.lock = false;
          $scope.setCandidate(data);
          return;
        case 'start_vote':
          $scope.isStart = true;
          $scope.time = 0;
          $timeout($scope.timer, 1000);
          $scope.isEnd = false;
          $scope.lock = true;
          return;
        case 'end_vote':
          $scope.isStart = false;
          $scope.isEnd = true;
          $scope.lock = false;
          return;
        case 'save':
          $scope.lock = false;
          $scope.isEnd = false;
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
    if ($scope.lock) return;
    $scope.request('next');
  }

  $scope.prev = function(){
    if ($scope.lock) return;
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
    if ($scope.lock) return;

    if ($scope.project) {
      $window.location.href = '/director/result?project='+$scope.project.id;
    };
  }
}