function LoginCtrl ($scope, $http, $window) {

  $scope.isError = false;
  $scope.error = '';

  $scope.submit = function(user){
    if (user && user.username && user.password) {
      $http.post('login', user).
      success(function(data, status, headers, config){
        if (data.error) {
          $scope.error = data.error;
          $scope.isError = true;
        }else if(data.success && data.redirect){
          $window.location.pathname = data.redirect;
        }
      }).
      error(function(data, status, headers, config){

      });
    }else{
      $scope.error = 'Please input your username and password';
      $scope.isError = true;
    }
  };

  $scope.clean = function(){
    $scope.isError = false;
    $scope.error = '';
  }
}