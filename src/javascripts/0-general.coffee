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
	'$location',
	($rs, $cookie, $location) ->
		$rs.logInUser = (username) ->
			$cookie.put 'username', username
			$rs.userStatus.isLogin = true
			$rs.userStatus.name = username

		$rs.logOut = (username) ->
			$cookie.delete 'username'
			$rs.userStatus.isLogIn = false
		
		$rs.userStatus = 
			isLogin: false


		$rs.on '$routeChangeStart', (event, currRoute, prevRoute) ->
			if !($rs.userStatus.isLogIn) && prevRoute.access.needLogIn
				$location.path '/'

]



window.angularApp.config [
	'$routeProvider',
	($routeProvider) ->
		$routeProvider
			.when '/',
				templateUrl: "#{window.HTMLServer}/home.html"
				controller: "IndexController"
				access:
					needLogIn: false

			.when '/dashboard',
				templateUrl: "#{window.HTMLServer}/dashboard.html"
				controller: "DashboardController"
				access:
					needLogIn: true

			.when '/room/:roomId',
				templateUrl: "#{window.HTMLServer}/show.html"
				controller: "RoomController"
				access:
					needLogIn: false

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