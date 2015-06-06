window.angularApp
	.controller 'IndexController', [
		'$scope',
		'$rootScope',
		'$http',
		'$cookieStore',
		'$location',
		($s, $rs, $http, $cookie, $location) ->
			$s.user = {}
			UI.init()
	]