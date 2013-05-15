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

var UserResetPasswordCtrl = function($scope, $route, $location, $routeParams, $http, $timeout){
  $scope.$location = $location;
  $scope.$http = $http;
  $scope.$route = $route;
  $scope.$routeParams = $routeParams;
  $scope.$timeout = $timeout;

  $scope.isError = false;
  $scope.error = '';

  $scope.submit = function(user){
    var id = $scope.$routeParams.id;
    if (user && user.password && id) {
      
      if (user.password != user.repassword) {
        $scope.error = 'Please confirm the repeated password';
        $scope.alertStyle = 'alert-error';
        $scope.isError = true;
        return;
      };

      $scope.$http.post('/forgot/'+id, user).
      success(function(data, status, headers, config){
        if (data.error) {
          $scope.error = data.error;
          $scope.alertStyle = 'alert-error';
          $scope.isError = true;
        }else if(data.success && data.redirect){
          $scope.error = 'Reset Success. Please wait for redirect!';
          $scope.alertStyle = 'alert-info';
          $scope.isError = true;

          // setTimeout(function() {
          //   $scope.$location.url(data.redirect);
          // }, 2000);
          $scope.$timeout(function() {
            $scope.$location.url(data.redirect);
          }, 2000);
        }
      }).
      error(function(data, status, headers, config){

      });

    }else{
      $scope.error = 'Please input the information completely';
      $scope.alertStyle = 'alert-error';
      $scope.isError = true;
      return;
    }
  };

  $scope.clean = function(){
    $scope.isError = false;
    $scope.error = '';
  }
}

var UserFindPasswordCtrl = function($scope, $location, $http){
  $scope.$http = $http;
  $scope.$location = $location;

  $scope.$isError = false;
  $scope.error = '';

  function generateCode(){
    var num = Math.random();
    return (num*100000000).toFixed(0);
  }

  $scope.init = function(){
    Recaptcha.create("6Lf1UuESAAAAAM2rzsN4cHNqzloSBVrjCLkVm8BB", 'recaptcha_div', { theme: "red", callback: Recaptcha.focus_response_field });
  }

  $scope.submit = function(user){
    if (user && user.email) {
      if (!util.checkEmailInput(user.email)) {
        $scope.error = 'Email format error';
        $scope.alertStyle = 'alert-error';
        $scope.isError = true;
        return;
      };

      $scope.error = "Sending request to server, wait...";
      $scope.alertStyle = 'alert-success';
      $scope.isError = true;

      user.recaptcha_challenge_field = Recaptcha.get_challenge();
      user.recaptcha_response_field = Recaptcha.get_response();

      $scope.$http.post('/forgot', user).
      success(function(data, status, headers, config){
        if (data.error) {
          $scope.error = data.error;
          $scope.alertStyle = 'alert-error';
          $scope.isError = true;
        }else if(data.success){
          $scope.error = data.success;
          $scope.alertStyle = 'alert-info';
          $scope.isError = true;
        }
      }).
      error(function(data, status, headers, config){

      });
    }else{
      $scope.error = 'Please input the information completely';
      $scope.alertStyle = 'alert-error';
      $scope.isError = true;
      return;
    }
  }

  $scope.clean = function(){
    $scope.isError = false;
    $scope.error = '';
  }
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

var UserHomeCtrl = function($scope, $route, $location, $http, $timeout){
  $scope.$location = $location;
  $scope.$http = $http;
  $scope.$route = $route;

  $scope.init = function(){
    $scope.$http.post('/user/project').
    success(function(data, status, headers, config){
      if (data.projects) $scope.projects = data.projects;
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.refresh =function(){
    // $scope.$route.reload();
    $scope.init();
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
  $scope.isError = false;

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
    $scope.$http.get('/management/project/all').
      success(function(data, status, headers, config){
        if (!data.error) $scope.projects = data.records;
      }).
      error(function(data, status, headers, config){

      });
  }

  $scope.save = function(){
    if (!$scope.project || !$scope.project.id || !$scope.project.name || !$scope.project.key) {
      $scope.isError = true;
      $scope.error = 'Please input project id, name and access key';
      return;
    };

    $scope.$http.post('/management/project', {project: $scope.project}).
    success(function(data, status, headers, config){
      if (data.success) {
        $('#project-modal').modal('hide')
        $scope.$route.reload();
      }else{
        if (data.error) {
          $scope.isError = true;
          $scope.error = data.error;
          return;
        };
        alert('error');
      }
    }).
    error(function(data, status, headers, config){

    });
  }

  $scope.release = function(project){
    $scope.$http.post('/management/release/', {project: project}).
      success(function(data, status, headers, config){
        alert(data.error || data.feedback);
      }).
      error(function(data, status, headers, config){
        alert('error');
      });
  }

  $scope.delete = function(project){
    $scope.$http.delete('/management/project/'+project._id).
      success(function(data, status, headers, config){
        if (data.success) {
          $scope.$route.reload();
        }else{
          alert('delete project error');
        }
      }).
      error(function(data, status, headers, config){
      });
  }

  $scope.clean = function(){
    $scope.isError = false;
    $scope.error = '';
  }

  util.manageLogout($scope, '/management/logout');
}

var ManageCandidateCtrl = function($scope, $route, $location, $http){
  $scope.$location = $location;
  $scope.$http = $http;
  $scope.$route = $route;
  $scope.isError = false;
  $scope.type = [
    {name: "image", value: "image"},
    {name: "video", value: "video"},
  ]
  $scope.isUploadFile = false;
  $scope.isAddExternalFile = false;

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
    $scope.$http.get('/management/candidate/all').
      success(function(data, status, headers, config){
        if (!data.error) $scope.candidates = data.records;
      }).
      error(function(data, status, headers, config){

      });

    $('#form-upload-container').on('change', function(){
      $('#fileSelectedName').text($('#form-upload-container')[0].files[0].name);
    });
  }

  $scope.toogleUploadFileBtn = function(){
    $scope.isUploadFile = !$scope.isUploadFile;
    $scope.isAddExternalFile = false;
  }

  $scope.toogleAddExternalFileBtn = function(){
    $scope.isAddExternalFile = !$scope.isAddExternalFile;
    $scope.isUploadFile = false;
  }

  $scope.selectFile = function(){
    $('#form-upload-container').click();
  }

  $scope.uploadFile = function(candidate){
    var fd = new FormData();
    fd.append('files', $('#form-upload-container')[0].files[0]);

    $.ajax({
      url: '/upload',
      type: 'post',
      xhr: function(){
        sXHR = $.ajaxSettings.xhr();
        if(sXHR.upload){
          sXHR.upload.addEventListener('progress',function(evt){
            if (evt.lengthComputable) {
              var percentComplete = Math.round(evt.loaded * 100 / evt.total);
              $('#progressbar').css('width', percentComplete+'%');
            }
            else {
              alert('unable to compute!');
            }
          }, false);
        }
        return sXHR;
      },
      data: fd,
      cache: false,
      contentType: false,
      processData: false,
      error: function(data, textStatus, jqXHR){
        alert('upload error');
      },
      success: function(data, textStatus, jqXHR){
        $('#filePath').val(data.complete);
        $scope.isUploadFile = false;
        $scope.isAddExternalFile = true;
        $scope.$apply();
      }
    });
  }

  $scope.save = function(candidate){
    if (candidate) {
      candidate.source = $('#filePath').val();
    };

    if (!candidate || !candidate.author || !candidate.source || !candidate.title || !candidate.type) {
      $scope.isError = true;
      $scope.error = 'Please input candidate author, source type, source and title';
      return;
    };

    $scope.$http.post('/management/candidate', {candidate: candidate}).
      success(function(data, status, headers, config){
        if (data.success) {
          $scope.$route.reload();
        }else{
          if (data.error) {
            $scope.isError = true;
            $scope.error = data.error;
            return;
          };
          alert('error');
        }
      }).
      error(function(data, status, headers, config){

      });
  }

  $scope.delete = function(candidate){
    $scope.$http.delete('/management/candidate/'+candidate._id).
      success(function(data, status, headers, config){
        if (data.success) {
          $scope.$route.reload();
        }else{
          alert('delete candidate error');
        }
      }).
      error(function(data, status, headers, config){

      });
  }

  $scope.clean = function(){
    $scope.isError = false;
    $scope.error = '';
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
    $scope.$http.get('/management/user/all').
      success(function(data, status, headers, config){
        if (!data.error) $scope.users = data.records;
      }).
      error(function(data, status, headers, config){

      });
  }

  $scope.delete = function(user){
    $scope.$http.delete('/management/user/'+user._id).
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
  $scope.file = {
    link: null,
    name: ''
  }
  $scope.isGetFile = false

  $scope.exportData = function(id){
    $scope.$http.get('/management/export/'+id).
      success(function(data, status, headers, config){
        if (data.error) {
          alert(data.error);
        }else{
          $scope.file.name = 'get file';
          $scope.file.link = data.link;
          $scope.isGetFile = true;
        }
      }).
      error(function(data, status, headers, config){
        alert('export data error');
      });
  }

  $scope.init = function(){
    $scope.$http.get('/management/project/'+$scope.$routeParams.projectId).
      success(function(data, status, headers, config){
        $scope.project = data.records[0];
      }).
      error(function(data, status, headers, config){

      });

    $scope.$http.get('/management/candidate/all').
      success(function(data, status, headers, config){
        if (!data.error) $scope.all = data.records;
      }).
      error(function(data, status, headers, config){

      });

    $scope.$http.get('/management/project/candidates/'+$scope.$routeParams.projectId+'/all').
      success(function(data, status, headers, config){
        if (!data.error) $scope.candidates = data.candidates;
      }).
      error(function(data, status, headers, config){

      });
  }

  $scope.add = function(){
    var candidateId = $('#candidate-selection').find("option:selected").val();

    $scope.$http.put('/management/project/candidates/'+$scope.$routeParams.projectId+'/'+candidateId, {candidate: {_id: candidateId}}).
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
    $scope.$http.delete('/management/project/candidates/'+$scope.$routeParams.projectId+'/'+candidate._id).
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
  $scope.qrcode = 'http://chart.apis.google.com/chart?chs=200x200&cht=qr&chl=http://'+$window.location.host+'&choe=UTF-8&chld=Q|2'
  $scope.lock = false;
  $scope.voted = 0;
  $scope.handle = null;
  $scope.users = [];

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

  $scope.query = function(){
    $scope.$http.post('/director/exec', {action: 'query', voted: $scope.voted}, {timeout: 9999999999}).
    success(function(data, status, headers, config){
      if (data.redirect) {
        return $scope.$location.path(data.redirect);
      }else if (data.error) return;
      else if(data.close) return;

      if (data.voted) {
        $scope.voted = data.voted;
        $scope.users = data.list;
        // $scope.$apply();
      };

      $scope.handle = setTimeout($scope.query, 1000);
    }).
    error(function(data, status, headers, config){
      $scope.handle = setTimeout($scope.query, 1000*10);
    });
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
          $scope.voted = 0;
          return;
        case 'start_vote':
          $scope.voted = 0;
          $scope.isStart = true;
          $scope.time = 0;
          $scope.users = [];
          $timeout($scope.timer, 1000);
          $scope.isEnd = false;
          $scope.lock = true;
          $scope.query();
          return;
        case 'end_vote':
          $scope.isStart = false;
          $scope.isEnd = true;
          $scope.lock = false;
          if ($scope.handle)
            clearTimeout($scope.handle);
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
      $scope.query();
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
  $scope.mark = {
    score: null,
    comment: null
  }

  $scope.choices = [
    {score: 1, express: "1 Destructive"},
    {score: 2, express: "2 No Idea"},
    {score: 3, express: "3 Invisible"},
    {score: 4, express: "4 I don't know what this brand stands for"},
    {score: 5, express: "5 I understand the brand's purpose"},
    {score: 6, express: "6 An intelligent idea"},
    {score: 7, express: "7 An inspiring idea, beautifully crafted"},
    {score: 8, express: "8 Changes the way people think and fell"},
    {score: 9, express: "9 Changes the way people live"},
    {score: 10, express: "10 Changes the world"}
  ];

  $scope.mark.score = $scope.choices[5];

  $scope.request = function(){
    var projectId = $scope.$routeParams.projectId;
    $scope.$http.post('/director/status', {status: $scope.status, candidate: $scope.candidate, projectId: projectId}, {timeout: 9999999999}).
    success(function(res, status, headers, config){

      if (res.redirect) {
        return $scope.$location.path(res.redirect);
      }else if (res.error) return;

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
      setTimeout($scope.request, 1000*10);
    });
  }

  $scope.submit = function(){
    if (!$scope.mark || !$scope.mark.score) {
      $scope.isError = true;
      $scope.error = 'Please input your score and comment.';
      return;
    };

    var projectId = $scope.$routeParams.projectId;
    $scope.$http.post('/director/vote', {candidate: $scope.candidate, mark: {score: $scope.mark.score.score, comment: $scope.mark.comment}, projectId: projectId}).
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

  util.manageLogout($scope, '/logout');
}