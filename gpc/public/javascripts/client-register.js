function RegisterCtrl ($scope, $http, $window){

  $scope.isError = false;
  $scope.error = '';

  $scope.submit = function(user){

    if (user && user.username && user.password && user.email) {

      if (user.password != user.repassword) {
        $scope.error = 'Please confirm the repeated password';
        $scope.isError = true;
        return;
      };

      if (!util.checkEmailInput(user.email)) {
        $scope.error = 'Email format error';
        $scope.isError = true;
        return;
      };

      $http.post('register', user).
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
      $scope.error = 'Please input the information completely';
      $scope.isError = true;
      return;
    }
  };

  $scope.clean = function(){
    $scope.isError = false;
    $scope.error = '';
  }

}