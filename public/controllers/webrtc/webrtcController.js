'use strict';

define(['app'], function(app) {
    
    var injectParams = ['$rootScope','$location', 'authService', 'webRTCSocketService'];

    var WebrtcController = function($rootScope, $location, authService, webRTCSocketService) {
        
        var vm = this;
        
        vm.username = webRTCSocketService.username;
        vm.remoteUser = webRTCSocketService.remotePeerUsername;
        vm.roomUUID = webRTCSocketService.uuid;
        
        // Reset call configuration
        vm.hangup = function(){
            sendMessage('bye');
            handleRemoteHangup();
        };
            
        
        var socket = webRTCSocketService.socket;
        
        // SETUP WEBRTC VARIABLES
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
        // set getUserMedia constraints
        var constraints = { video: false, audio: true };
        // streams
		var localStream = null;
		var remoteStream = null;
        // PeerConnection
		var pc = null;
        // PeerConnection ICE protocol configuration (either firefox or Chrome)
		var pc_config = webrtcDetectedBrowser === 'firefox' ?
						{'iceServers' : [{'url' : 'stun:23.21.150.121'}]} : //IP address
						{'iceServers' : [{'url' : 'stun:stun.l.google.com:19302'}]};
        
        var pc_constraints  = {
			'optional' : [
				{'DtlsSrtpKeyAgreement': true}
		]};
        var sdpConstraints 	= {};
        // Config variables
        var isRoomReady = false;
        var isStarted = false;
        // The element where we add the audio
        var remoteAudio = document.getElementById('remoteAudio');
        console.log(remoteAudio);
        
        
        // Initialize the controller
        function init() {
            console.log("is started -------------------->       "+ isStarted);
            // The initiator only can trigger the getUserMedia(). If not all the time we will be in that page.
            if(webRTCSocketService.initiator){
                navigator.getUserMedia(constraints, handleInitiatorUserMedia, handleInitiatorUserMediaError);
            // The joiner accept the call so it has to attach the media.    
            } else {
                navigator.getUserMedia(constraints, handleJoinerUserMedia, handleJoinerUserErrorMedia);
            }
        }
        
        // Store the initiator stream media and send the call request
		// @stream: media
		function handleInitiatorUserMedia(stream) {
            localStream = stream;
            socket.emit('initiator-request', webRTCSocketService.remotePeerSId);
			console.log('Adding initiator local stream...');
		}

		// Manage stream media error
		// @error: message error
		function handleInitiatorUserMediaError(error) {
			console.log('navigator.getUserMedia error: '+ error.name);
            $location.path('/dashboard');
		}
        
        // Store the joiner stream media and send back the respond to the initiator
        // that the joiner gets the media
		// @stream: media
        function handleJoinerUserMedia(stream) {
            isRoomReady = true;
            localStream = stream;
            console.log("Joiner get the media. Ready the room to start negotiation");
            sendMessage('got-user-media');
            
        }
        
        function handleJoinerUserErrorMedia(error) {
            
        }
        
        // Joiner is ready. Update initiator roomUUID and set the room as ready
        // @uuid: room identifier for the call
        socket.on('update-uuid', function(uuid) {
            console.log('Initiator room is ready for the negotiation. Waiting the getUserMedia message');
            webRTCSocketService.uuid = uuid;
            isRoomReady = true;
        });
        
        socket.on('message', function(message){
            console.log(message);
            if(message === 'got-user-media'){
                checkAndStart();
            // Remote Peer, in that case the initiator, send description of the SDP via server and the
            // joiner set as RemoteDescription
            } else if (message.type === 'offer') {
                if (!webRTCSocketService.initiator && !isStarted) {
                    console.log('offer');
                    checkAndStart();
                }
                pc.setRemoteDescription(new RTCSessionDescription(message));
                doAnswer();

            // The joiner sends a SDP description and the initiator set as Remote Description
            } else if (message.type === 'answer' && isStarted) {
                pc.setRemoteDescription(new RTCSessionDescription(message));

            // They send candidate information to now which is their ICECandidate
            } else if(message.type === 'candidate' && isStarted) {
                var candidate = new RTCIceCandidate({sdpMLineIndex:message.label, candidate:message.candidate});
                pc.addIceCandidate(candidate);
            }  else if (message === 'bye' && isStarted) {
                handleRemoteHangup();
            }
        });
    
        
        // Send messages to the server socket
        // @message: The message that the socket will receive
        function sendMessage(message) {
            var node = {"message" : message, "room" : webRTCSocketService.uuid };
            socket.emit('message', node);
        }
        // Channel negotiation trigger function
        function checkAndStart() {
            if(!isStarted && typeof localStream != 'undefined' && isRoomReady) {
				createPeerConnection();
				isStarted = true;
				if(webRTCSocketService.initiator) {
					doCall();
				}
			}
        }
        // PeerConnection management...
        function createPeerConnection(){
            console.log('createPeerConnection');
			try {
				pc = new RTCPeerConnection(pc_config, pc_constraints);
				pc.addStream(localStream);
				pc.onicecandidate = handleIceCandidate;

				console.log('Created RTCPeerConnection with:\n'+
				' config: \'' + JSON.stringify(pc_config) + '\';\n' +
				' constraints: \'' + JSON.stringify(pc_constraints) + '\'.');
			} catch (e) {
				console.log('Failed to create PeerConnection, exception: ' + e.message);
				alert('Cannot create RTCPeerConnection object.');
				return;
			}

			pc.onaddstream = handleRemoteStreamAdded;
			pc.onremovestream = handleRemoteStreamRemoved;
        }
        
        // Remote stream handlers...
		function handleRemoteStreamAdded(event){
			console.log('Remote stream added');
			attachMediaStream(remoteAudio, event.stream);
			remoteStream = event.stream;
		}

		function handleRemoteStreamRemoved(event){
			console.log('Remote stream removed. Event: ' + event);
		}
        // Create offer
        function doCall() {
            console.log('Creating offer...');
			pc.createOffer(setLocalAndSendMessage, onSignalingError, sdpConstraints);
        }
        
        // Create answer
		function doAnswer(){
			console.log('Sending answer to peer');
			pc.createAnswer(setLocalAndSendMessage, onSignalingError, sdpConstraints);
		}

		// Success handler for both createOffer() and createAnswer()
		function setLocalAndSendMessage(sessionDescription){
			pc.setLocalDescription(sessionDescription);
			sendMessage(sessionDescription);
		}
        
        // Signaling error handler
		function onSignalingError(error) {
			console.log('Failed to create a signaling message: ' + error.name);
		}

        
        function handleIceCandidate(event){
            console.log('handleIceCandidate event: ', event);
			if(event.candidate){
				sendMessage({
					type: 'candidate',
					label: event.candidate.sdpMLineIndex,
					id: event.candidate.sdpMid,
					candidate: event.candidate.candidate
				});
			} else {
				console.log('End of candidate');
			}
        }
        
        function handleRemoteHangup(){
			console.log('Session terminated.');
			stop();
            localStream.stop();
            socket.removeListener()
            $location.path('/dashboard');
		}

		function stop(){
			// Remove the media for the Peer connection
			pc.removeStream(localStream);
			// Close the peer connection
			pc.close();
            // Reset client socket variables
            webRTCSocketService.initiator = false;
            webRTCSocketService.joinerUsername = null;
            webRTCSocketService.remotePeerSId = null;
            webRTCSocketService.remotePeerUsername = null;
            webRTCSocketService.uuid = null;
            // Reset webRTC room variables
            pc = null;
            
		}
        
        init();
    };

    WebrtcController.$inject = injectParams;

    app.register.controller('WebrtcController', WebrtcController);
});