angular.module('lb-gpc.service',[]).factory('$cookie',['$window',function(win){
    return {
        get : function(name){
            var cookieStr = "; "+ document.cookie+"; ";
            var index = cookieStr.indexOf("; "+name+"=");
            if(index!=-1){
                var s = cookieStr.substring(index+name.length+3,cookieStr.length);
                return unescape(s.substring(0,s.indexOf(";")));
            }else{
                return null;
            }
        },
        set : function(name,value,expires){
            var expDays = expires*24*60*60*1000;
            var expDate = new Date();
            expDate.setTime( expDate.getTime()+expDays );
            var expString = expires ? "; expires ="+expDate.toGMTString() : "";
            var pathString= ";path=/" ;
            document.cookie = name +"=" + escape(value) + expString + pathString ;
        },
        del : function(name){
            var exp = new Date( new Date().getTime()-1 );
            var s = this.read(name);
            if(s!=null){document.cookie = name+"="+s+";expires="+exp.toGMTString()+";path=/"};
        }
    }
}]);

angular.module('lb-gpc', ['lb-gpc.service']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider.
      when('/', {templateUrl: '/template/login.html', controller: UserLoginCtrl}).
      when('/login',  {redirectTo: '/'}).
      when('/register', {templateUrl: '/template/register.html', controller: UserRegisterCtrl}).
      when('/home', {templateUrl: '/template/home.html', controller: UserHomeCtrl}).
      when('/management', {templateUrl: '/template/login.html', controller: ManageLoginCtrl}).
      when('/management/project', {templateUrl: '/template/manage-project.html', controller: ManageProjectCtrl}).
      when('/management/project/candidates/:projectId', {templateUrl: '/template/manage-project-candidates.html', controller:ManageProjectCandidatesCtrl}).
      when('/management/candidate', {templateUrl: '/template/manage-candidate.html', controller: ManageCandidateCtrl}).
      when('/management/user', {templateUrl: '/template/manage-user.html', controller: ManageUserCtrl}).
      when('/director', {templateUrl: '/template/director.html', controller: DirectorCtrl}).
      when('/director/login', {templateUrl: '/template/login.html', controller: DirectorLoginCtrl}).
      when('/director/result/:projectId', {templateUrl: '/template/result.html', controller: DirectorResultCtrl}).
      when('/director/vote/:projectId', {templateUrl: '/template/vote.html', controller: VoteCtrl}).
      when('/forgot', {templateUrl: '/template/forgot.html', controller: UserFindPasswordCtrl}).
      when('/forgot/:id', {templateUrl: '/template/reset.html', controller: UserResetPasswordCtrl}).
      otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);


