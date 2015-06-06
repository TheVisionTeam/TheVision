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
							$rs.logInUser user.name
							$location.path '/dashboard'
						else
							$rs.logOut user.name
							$('#regist').modal 'toggle'


			UI.init()


	]
	.controller 'RoomController', [
		'$scope',
		'$rootScope',
		'$http',
		'$cookieStore',
		'$location',
		($s, $rs, $http, $cookie, $location) ->
			$s.location = $location
			$s.hasUploader = !!($location.hash)
			UI.init()


	]