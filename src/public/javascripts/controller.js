var MainCntl = function($scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
}

var login = function($scope, api){
  $scope.isError = false;
  $scope.error = '';

  $scope.submit = function(user){
    if (user && user.username && user.password) {
      $scope.$http.post(api, user).
      success(function(data, status, headers, config){
        if (data.error) {
          $scope.error = data.error;
          $scope.isError = true;
        }else if(data.success && data.redirect){
          $scope.$location.path(data.redirect);
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

var util = {
  checkEmailInput: function(email){
    return /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email);
  },
  manageLogout: function($scope, api){
    $scope.logout = function(){
      $scope.$http.get(api).
        success(function(data, status, headers, config){
          if(data.success && data.redirect){
            $scope.$location.path(data.redirect);
          }else{
            alert('error');
          }
        }).
        error(function(data, status, headers, config){
          alert('error');
        });
    }
  }
}

var UserLoginCtrl = function($scope, $location, $http){
  $scope.$location = $location;
  $scope.$http = $http;

  $scope.config = {
    isNeed : true,
    link: '/register',
    entry: 'Register',
    title: 'User Login',
    account: 'Username',
    key: 'Password',
    isRemember: true,
    button: 'Sign in'
  }

  login($scope, 'login');
}

var UserRegisterCtrl = function($scope, $location, $http){
  $scope.$http = $http;
  $scope.$location = $location;

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

      $scope.$http.post('/register', user).
      success(function(data, status, headers, config){
        if (data.error) {
          $scope.error = data.error;
          $scope.isError = true;
        }else if(data.success && data.redirect){
          $scope.$location.url(data.redirect);
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

var UserHomeCtrl = function($scope, $route, $location, $http){
  $scope.$location = $location;
  $scope.$http = $http;

  $scope.init = function(){
    $scope.$http.post('/user/project').
    success(function(data, status, headers, config){
      if (data.directors) $scope.directors = data.directors;
    }).
    error(function(data, status, headers, config){

    });
  }

  util.manageLogout($scope, '/logout');
}

var ManageLoginCtrl = function($scope, $location, $http){
  $scope.$location = $location;
  $scope.$http = $http;

  $scope.config = {
    isNeed : false,
    link: '/#',
    entry: '#',
    title: 'Management Login',
    account: 'Admin',
    key: 'Access Key',
    isRemember: false,
    button: 'Sign in'
  }

  login($scope, 'management/login');
}

var ManageProjectCtrl = function($scope, $route, $location, $http){
  $scope.$location = $location;
  $scope.$http = $http;
  $scope.$route = $route;

  $scope.config = {
    project: 'active',
    candidate: '',
    user: '',
    modal: {
      id: 'project-modal',
      type: 'New Project'
    }
  }

  $scope.projects = new Array();

  $scope.init = function(){
    $scope.$http.post('/management/project/all').
    success(function(data, status, headers, config){
      if (!data.error) $scope.projects = data.records;
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.save = function(){
    $scope.$http.post('/management/project/add', {project: $scope.project}).
    success(function(data, status, headers, config){
      if (data.success) {
        $('#project-modal').modal('hide')
        $scope.$route.reload();
      }else{
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.delete = function(project){
    $scope.$http.post('/management/project/remove', {project:{id:project.id, name:project.name, key:project.key}}).
    success(function(data, status, headers, config){
      if (data.success) {
        $scope.$route.reload();
      }else{
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  util.manageLogout($scope, '/management/logout');
}

var ManageCandidateCtrl = function($scope, $route, $location, $http){
  $scope.$location = $location;
  $scope.$http = $http;
  $scope.$route = $route;

  $scope.config = {
    project: '',
    candidate: 'active',
    user: '',
    modal: {
      id: 'candidate-modal',
      type: 'New Candidate'
    }
  }

  $scope.candidates = new Array();

  $scope.init = function(){
    $scope.$http.post('/management/candidate/all').
    success(function(data, status, headers, config){
      if (!data.error) $scope.candidates = data.records;
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.save = function(){
    $scope.$http.post('/management/candidate/add', {candidate: $scope.candidate}).
    success(function(data, status, headers, config){
      if (data.success) {
        $scope.$route.reload();
      }else{
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.delete = function(candidate){
    $scope.$http.post('/management/candidate/remove', {candidate: candidate}).
    success(function(data, status, headers, config){
      if (data.success) {
        $scope.$route.reload();
      }else{
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  util.manageLogout($scope, '/management/logout');
}

var ManageUserCtrl = function($scope, $route, $location, $http){
  $scope.$location = $location;
  $scope.$http = $http;
  $scope.$route = $route;

  $scope.config = {
    project: '',
    candidate: '',
    user: 'active',
    modal: {
      id: '',
      status: 'disabled',
      type: 'New User'
    }
  }

  $scope.users = new Array();

  $scope.init = function(){
    $scope.$http.post('/management/user/all').
    success(function(data, status, headers, config){
      if (!data.error) $scope.users = data.records;
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.delete = function(user){
    $scope.$http.post('/management/user/remove', {user: user}).
    success(function(data, status, headers, config){
      if (data.success) {
        $scope.$route.reload();
      }else{
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  util.manageLogout($scope, '/management/logout');
}

var ManageProjectCandidatesCtrl = function($scope, $route, $location, $routeParams, $http){
  $scope.$location = $location;
  $scope.$http = $http;
  $scope.$route = $route;
  $scope.$routeParams = $routeParams;

  $scope.config = {
    project: '',
    candidate: '',
    user: '',
    modal: {
      id: 'select-candidate-modal',
      type: 'Add Candidate'
    }
  }

  $scope.candidates = new Array();
  $scope.all = new Array();

  $scope.init = function(){
    $scope.$http.post('/management/project/query', {id: $scope.$routeParams.projectId}).
      success(function(data, status, headers, config){
        $scope.project = data.records[0];
      }).
      error(function(data, status, headers, config){

      });

    $http.post('/management/candidate/all').
      success(function(data, status, headers, config){
        if (!data.error) $scope.all = data.records;
      }).
      error(function(data, status, headers, config){

      });

    $http.post('/management/project/candidates/all', {project: {id: $scope.$routeParams.projectId}}).
      success(function(data, status, headers, config){
        if (!data.error) $scope.candidates = data.candidates;
      }).
      error(function(data, status, headers, config){

      });
  }

  $scope.add = function(){
    var candidateId = $('#candidate-selection').find("option:selected").val();
    var projectId = $('#project-id').attr('data-project-id');

    $http.post('/management/project/candidates/add', {candidate: {_id: candidateId}, project:{id: projectId}}).
    success(function(data, status, headers, config){
      if (data.success) {
        $scope.$route.reload();
      }else{
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.delete = function(candidate){
    var projectId = $('#project-id').attr('data-project-id');

    $http.post('/management/project/candidates/remove', {candidate: {_id: candidate._id}, project:{id: projectId}}).
    success(function(data, status, headers, config){
      if (data.success) {
        $scope.$route.reload();
      }else{
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  util.manageLogout($scope, '/management/logout');
}

var DirectorLoginCtrl = function($scope, $location, $http){
  $scope.$location = $location;
  $scope.$http = $http;

  $scope.config = {
    isNeed : false,
    link: '#',
    entry: '',
    title: 'Director Login',
    account: 'Project id',
    key: 'Access Key',
    isRemember: false,
    button: 'Sign in'
  }

  $scope.isError = false;
  $scope.error = '';

  $scope.submit = function(user){
    if (user && user.username && user.password) {

      $http.post('/director/login', {id: user.username, key: user.password}).
      success(function(data, status, headers, config){
        if (data.error) {
          $scope.error = data.error;
          $scope.isError = true;
        }else if (data.success && data.redirect){
          $scope.$location.path(data.redirect);
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

var DirectorCtrl = function($scope, $location, $http, $window, $timeout){
  $scope.$location = $location;
  $scope.$http = $http;

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
    $scope.$http.post('/director/exec', {action: action}).
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
      $scope.$location.path('/director/result/'+$scope.project.id);
    };
  }
}

var DirectorResultCtrl = function($scope, $route, $location, $routeParams, $http){
  $scope.$location = $location;
  $scope.$http = $http;
  $scope.$route = $route;
  $scope.$routeParams = $routeParams;

  $scope.candidates = new Array();
  $scope.project = null;
  $scope.candidate = null;
  $scope.marks = new Array();

  $scope.init = function(){
    var param = $scope.$routeParams
    $scope.project = {id: param.projectId};
    if (!$scope.project) return alert('error');

    $scope.$http.post('/director/exec', {action: 'result'}).
    success(function(data, status, headers, config){
      if (!data.error){
        $scope.candidates = data.candidates;
        $scope.setCandidate($scope.candidates[0]);
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.setCandidate =function(candidate){
    $scope.candidate = candidate;
    $scope.marks = candidate.marks;
  }

  $scope.goBack = function(){
    $scope.$location.path('/director');
  }

  util.manageLogout($scope, '/director/logout');
}

var VoteCtrl = function($scope, $http, $location, $route, $routeParams){
  $scope.$http = $http;
  $scope.$location = $location;
  $scope.$route = $route;
  $scope.$routeParams = $routeParams;

  $scope.status = null;
  $scope.candidate = null;
  $scope.isStart = false;
  $scope.isForbidden = false;
  $scope.isError = false;

  $scope.open = function(){
    var projectId = $scope.$routeParams.projectId;
    $scope.$http.post('/director/open', {id: projectId}).
    success(function(data, status, headers, config){
      if (data.success) {
        $scope.request();
      }else if(data.error){
        $scope.$location.path('/home');
      }
    }).
    error(function(data, status, headers, config){
      $scope.$location.path('/home');
    });
  }

  $scope.request = function(){

    $scope.$http.post('/director/status', {status: $scope.status, candidate: $scope.candidate}, {timeout: 9999999999}).
    success(function(data, status, headers, config){

      var res =data;
      if (data.error) return;

      $scope.status = res.status;
      switch(res.status){
        case 'show':
          $scope.candidate = res.candidate;
          $scope.isStart = false;
          $scope.isForbidden = false;
          break;
        case 'process':
          if (res.candidate) {$scope.candidate = res.candidate;};
          $scope.isStart = true;
          $scope.isForbidden = false;
          break;
        case 'end':
          if (res.candidate) {$scope.candidate = res.candidate;};
          $scope.isStart = false;
          $scope.isForbidden = true;
        default:
          break;
      }

      setTimeout($scope.request, 1000);
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.submit = function(){
    if (!$scope.mark || !$scope.mark.score) {
      $scope.isError = true;
      $scope.error = 'Please input your score and comment.';
      return;
    };

    $scope.$http.post('/director/vote', {candidate: $scope.candidate, mark: $scope.mark}).
    success(function(data, status, headers, config){
      if (data.success) {
        $scope.isStart = false;
        $scope.isForbidden = true;
      };
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.clean = function(){
    $scope.isError = false;
    $scope.error = '';
  }
}