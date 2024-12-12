var stream;
var mediaRecorder;
var audioChunks = [];

function getUserMedia(options, successCallback, failureCallback) {
	var api =
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia;
	if (api) {
		return api.bind(navigator)(options, successCallback, failureCallback);
	}
}

function getStream() {
	if (
		!navigator.getUserMedia &&
		!navigator.webkitGetUserMedia &&
		!navigator.mozGetUserMedia &&
		!navigator.msGetUserMedia
	) {
		alert('User Media API not supported.');
		return;
	}

	var constraints = { audio: true };
	getUserMedia(
		constraints,
		function (_stream) {
			var mediaControl = document.querySelector('audio');

			if ('srcObject' in mediaControl) {
				mediaControl.srcObject = _stream;
			} else if (navigator.mozGetUserMedia) {
				mediaControl.mozSrcObject = _stream;
			} else {
				mediaControl.src = (window.URL || window.webkitURL).createObjectURL(
					_stream,
				);
			}

			stream = _stream;

			mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.ondataavailable = recorderDataAvailable;
		},
		function (err) {
			alert('Error: ' + err);
		},
	);
}

function recorderDataAvailable(e) {
	if (e.data.size == 0) return;
	audioChunks.push(e.data);
}

function startRecording() {
	audioChunks = [];
	mediaRecorder.start();
	console.log('Recording started');
}

function stopRecording() {
	mediaRecorder.stop();
	console.log('Recording stopped');
	mediaRecorder.onstop = () => {
		var blob = new Blob(audioChunks, { type: 'audio/mpeg-3' });
		var audioURL = URL.createObjectURL(blob);
		var audio = new Audio(audioURL);
		audio.play();
	};
}

// getStream();

const audioContext = new AudioContext();
const audio = new Audio('www/audio/test.mp3');

const audioSource = audioContext.createMediaElementSource(audio);
const volume = audioContext.createGain();
volume.gain.value = 0.2;

audioSource.connect(volume);
audioSource.connect(audioContext.destination);

volume.connect(audioContext.destination);

function play() {
	if (audioContext.state === 'suspended') {
		audioContext.resume();
	}

	audio.play();
}

function pause() {
	audio.pause();
}

function stop() {
	audio.pause();
	audio.currentTime = 0;
}
