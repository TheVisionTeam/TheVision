window.angularApp
	.controller 'IndexController', [
		'$scope',
		'$rootScope',
		'$http',
		'$cookieStore',
		'$location',
		($s, $rs, $http, $cookie, $location) ->
			$s.user = {}

			$s.regist = ->
				$http
						method: 'POST'
						url: "#{APIServer}/register"
						data:
							username: $s.user.name
							password: $s.user.password
					.success (data, _) ->
						if data
							$location.path '/dashboard'

			UI.init()


	]