window.angularApp = angular.module('TheVision', ['ngRoute', 'ngSanitize', 'ngCookies']);

window.APIServer = "";

window.HTMLServer = "../../";

window.angularApp.run([
  '$rootScope', '$cookieStore', '$location', function($rs, $cookie, $location) {
    $rs.logInUser = function(username) {
      $cookie.put('username', username);
      $rs.userStatus.isLogin = true;
      return $rs.userStatus.name = username;
    };
    $rs.logOut = function(username) {
      $cookie["delete"]('username');
      return $rs.userStatus.isLogIn = false;
    };
    if ($cookie.get('username')) {
      return $rs.userStatus = {
        isLogIn: true,
        name: $cookie.get('username')
      };
    } else {
      return $rs.userStatus = {
        isLogin: false
      };
    }
  }
]);

window.angularApp.config([
  '$routeProvider', function($routeProvider) {
    return $routeProvider.when('/', {
      templateUrl: window.HTMLServer + "/home.html",
      controller: "IndexController",
      access: {
        needLogIn: false
      }
    }).when('/dashboard', {
      templateUrl: window.HTMLServer + "/dashboard.html",
      controller: "DashboardController",
      access: {
        needLogIn: true
      }
    }).when('/room', {
      templateUrl: window.HTMLServer + "/show.html",
      controller: "RoomController",
      access: {
        needLogIn: false
      }
    }).otherwise({
      redirectTo: '/'
    });
  }
]);

window.UI = {
  enableModal: function() {
    return $('.modal-target').on('click', function() {
      var target;
      target = $(this).data('modal');
      console.log(target);
      return $("#" + target).modal('setting', 'transition', 'fade up').modal('toggle');
    });
  },
  RoomUploaderToggle: function() {
    $('#room').removeClass('has_uploader');
    $('#room .player').removeClass('hidden');
    $('#uploaderInfo').modal('show');
    $('.status i').removeClass('red').addClass('green');
    return $('.status').html("<i class=\"pot green\"></i> 已成功建立连接！");
  },
  init: function() {
    return this.enableModal();
  }
};

$(document).ready(function() {
  return window.UI.init();
});

window.angularApp.controller('IndexController', [
  '$scope', '$rootScope', '$http', '$cookieStore', '$location', function($s, $rs, $http, $cookie, $location) {
    $s.user = {};
    $s.regist = function() {
      return $http({
        method: 'POST',
        url: APIServer + "/register",
        data: {
          username: $s.user.name,
          password: $s.user.password
        }
      }).success(function(data, _) {
        if (data) {
          $rs.logInUser(user.name);
          return $location.path('/dashboard');
        } else {
          $rs.logOut(user.name);
          return $('#regist').modal('toggle');
        }
      });
    };
    return UI.init();
  }
]).controller('RoomController', [
  '$scope', '$rootScope', '$http', '$cookieStore', '$location', function($s, $rs, $http, $cookie, $location) {
    $s.location = $location;
    $s.hasUploader = !!$location.hash;
    return UI.init();
  }
]);
