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
		'$sce',
		($s, $rs, $http, $cookie, $location, $sce) ->
			$s.location = $location.hash()
			$s.hasUploader = !($s.location.length > 0)

			$s.sendDanmu = ->	
				socket = io("http://localhost:3001")
				top = Math.random() * 360
				fontSize = Math.random() * 20 + 20
				div = '<div class="dm" style="top: "' + top + 'px"; fontSize: "' + fontSize + 'px">' + $s.message + '</div>'
				socket.emit "danmaku", div
				$s.message = ""
			$s.url = "http://127.0.0.1:9200/room/#{$location.hash()}"
			UI.init()


	]