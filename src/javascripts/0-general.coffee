window.angularApp = angular.module 'TheVision', [
	'ngRoute',
	'ngSanitize',
	'ngCookies'
]

window.APIServer = "http://127.0.0.1:3000"
window.HTMLServer = "../../" 

window.angularApp.run [
	'$rootScope',
	'$cookieStore',
	($rs, $cookie) ->
		$rs.isSignIn = ->
			!!($cookie.get 'user')

]


window.angularApp.config [
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
	enableModal: ->
		$('.modal-target').on 'click', ->
			target = $(this).data 'modal'
			console.log target
			$("##{target}")
				.modal('setting', 'transition', 'fade up')
				.modal('toggle')
	init: ->
		@enableModal()

$(document).ready ->
	window.UI.init()