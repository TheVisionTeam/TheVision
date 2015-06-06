window.angularApp = angular.module('TheVision', ['ngRoute', 'ngSanitize', 'ngCookies']);

window.APIServer = "http://127.0.0.1:3000";

window.HTMLServer = "../../";

window.angularApp.run([
  '$rootScope', '$cookieStore', function($rs, $cookie) {
    return $rs.isSignIn = function() {
      return !!($cookie.get('user'));
    };
  }
]);

window.angularApp.config([
  '$routeProvider', function($routeProvider) {
    return $routeProvider.when('/', {
      templateUrl: window.HTMLServer + "/home.html",
      controller: "IndexController"
    }).when('/dashboard', {
      templateUrl: window.HTMLServer + "/dashboard.html",
      controller: "DashboardController"
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
    return UI.init();
  }
]);
