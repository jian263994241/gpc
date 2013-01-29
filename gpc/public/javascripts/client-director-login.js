function ProjectLoginCtrl($scope, $http, $window){
  $scope.isError = false;
  $scope.error = '';

  $scope.submit = function(project){
    if (project && project.id && project.key) {

      $http.post('/director/login', project).
      success(function(data, status, headers, config){
        if (data.error) {
          $scope.error = data.error;
          $scope.isError = true;
        }else if (data.success && data.redirect){
          $window.location.pathname = data.redirect;
        };
      }).
      error(function(data, status, headers, config){

      });

    }else{
      $scope.error = 'Please input your project name and access key';
      $scope.isError = true;
    }
  };

  $scope.clean = function(){
    $scope.isError = false;
    $scope.error = '';
  }
}