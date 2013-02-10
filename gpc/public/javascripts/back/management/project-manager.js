function ProjectManageCtrl($scope, $http, $window) {
  $scope.projects = new Array();

  $scope.init = function(){
    $http.post('/management/project/all').
    success(function(data, status, headers, config){
      if (!data.error) $scope.projects = data.records;
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.save = function(){
    $http.post('/management/project/add', {project: $scope.project}).
    success(function(data, status, headers, config){
      if (data.success) {
        $('#project-modal').modal('hide')
        $scope.refresh();
      }else{
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.delete = function(project){
    $http.post('/management/project/remove', {project:{id:project.id, name:project.name, key:project.key}}).
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