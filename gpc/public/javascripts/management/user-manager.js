function UserManageCtrl($scope, $http, $window) {
  $scope.users = new Array();

  $scope.init = function(){
    $http.post('/management/user/all').
    success(function(data, status, headers, config){
      if (!data.error) $scope.users = data.records;
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.delete = function(user){
    $http.post('/management/user/remove', {user: user}).
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