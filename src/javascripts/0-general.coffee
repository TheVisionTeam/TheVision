window.angularApp = angular.module 'TheVision', [
	'ngRoute',
	'ngSanitize',
	'ngCookies'
]

window.APIServer = "http://127.0.0.1:3000"
window.HTMLServer = "http://127.0.0.1:8080" 

window.angularApp.run [
	'$rootScope',
	'$cookieStore',
	($rs, $cookie) ->
		$rs.isSignIn = ->
			!!($cookie.get 'user')

]


widnow.angularApp.config [
	'$routeProvider',
	($routeProvider) ->
		$routeProvider
			.when '/',
				templateUrl: "#{window.HTMLServer}/home.html"
				controller: "IndexController"

			.when '/dashboard',
				templateUrl: "#{window.HTMLServer}/dashboard.html"
				controller: "DashboardController"

			.otherwise
				redirectTo: '/'
]

window.UI = 
	init: ->

$(document).ready ->
	window.UI.init()