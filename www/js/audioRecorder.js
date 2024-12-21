class AudioRecorder {
	constructor() {
		this.stream = null;
		this.mediaRecorder = null;
		this.audioChunks = [];
		this.$startRecording = document.querySelector('#record');
		this.$stopRecording = document.querySelector('#stoprecord');

		this.$startRecording.addEventListener('click', () => this.startRecording());
		this.$stopRecording.addEventListener('click', () => this.stopRecording());
	}

	createStream() {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			alert('User Media API not supported.');
			return;
		}

		var constraints = { audio: true };
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(_stream => {
				var mediaControl = document.querySelector('audio');

				if ('srcObject' in mediaControl) {
					mediaControl.srcObject = _stream;
				}

				this.stream = _stream;

				this.mediaRecorder?.stop();
				this.mediaRecorder = new MediaRecorder(this.stream);
				this.mediaRecorder.ondataavailable = e => this.recorderDataAvailable(e);
				this.mediaRecorder.onstop = () => this.handleStop();
			})
			.catch(function (err) {
				alert('Error: ' + err);
			});
	}

	recorderDataAvailable(e) {
		if (e.data.size == 0) return;
		this.audioChunks.push(e.data);
	}

	startRecording() {
		if (!this.mediaRecorder) return;

		this.audioChunks = [];
		this.mediaRecorder.start();
		console.log('Recording started');

		this.$startRecording.classList.add('hidden');
		this.$stopRecording.classList.remove('hidden');
	}

	stopRecording() {
		if (!this.mediaRecorder) return;

		this.mediaRecorder.stop();
		console.log('Recording stopped');

		this.$startRecording.classList.remove('hidden');
		this.$stopRecording.classList.add('hidden');
	}

	handleStop() {
		var blob = new Blob(this.audioChunks, { type: 'audio/webm' });
		var audioURL = URL.createObjectURL(blob);
		var audio = new Audio(audioURL);
		audio.play();
	}
}
