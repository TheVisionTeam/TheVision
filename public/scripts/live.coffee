(() ->
	PeerConnection = window.RTCPeerConnection or window.mozRTCPeerConnection or window.webkitRTCPeerConnection
	SessionDescription = window.RTCSessionDescription or window.mozRTCSessionDescription or window.webkitRTCSessionDescription
	if navigator.getUserMedia
		GET_USER_MEDIA = 'getUserMedia'
	else if navigator.mozGetUserMedia
		GET_USER_MEDIA = 'mozGetUserMedia'
	else if navigator.webkitGetUserMedia
		GET_USER_MEDIA = 'webkitGetUserMedia'
	else GET_USER_MEDIA = 'getUserMedia';

	v = document.createElement('video');
	if 'srcObject' in v
		SRC_OBJECT = 'srcObject'
	else if 'mozSrcObject' in v
		SRC_OBJECT = 'mozSrcObject'
	else if 'webkitSrcObject' in v
		SRC_OBJECT = 'webkitSrcObject'
	else SRC_OBJECT = 'srcObject';

	class PeerVideo
		constructor: (config) ->
			self = @
			config = {
				iceServers: [{url: "stun:stun.l.google.com:19302"}]
			}
			@pc = new PeerConnection(config)
			self.pc.onaddstream = (obj) ->
				self.domElement = document.createElement 'video'
				self.domElement.src = window.URL.createObjectURL obj.stream
			if config.isPublisher?
				navigator[GET_USER_MEDIA] 
					video: true
				, (stream) ->
					self.pc.onaddstream
						stream: stream
					self.pc.addStream stream

					self.pc.createOffer (offer) ->
						self.pc.setLocalDescription (new RTCSessionDescription(offer)), (() ->
							# TODO
							console.log offer
						), self.error
					, self.error

		setOffer: (@offer) ->
			self = @
			@pc.setRemoteDescription (new RTCSessionDescription(@offer)), () ->
				self.pc.createAnswer (answer) ->
					self.pc.setLocalDescription (new RTCSessionDescription(offer)), (() ->
					), self.error
				, self.error
			, self.error

		play: () ->
			@domElement.play()
			@onplay(@) if @onplay?

		pause: () ->
			@domElement.pause()
			@pc.close()
			@onpause(@) if @onpause?

	window.PeerVideo = PeerVideo
)()