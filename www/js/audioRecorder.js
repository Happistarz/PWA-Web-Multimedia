class AudioRecorder {
	constructor() {
		this.stream = null;
		this.mediaRecorder = null;
		this.audioChunks = [];
		this.voiceBuffer = null;
		this.audioContext = Tone.context;

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
				var mediaControl = document.getElementById('voiceStream');

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

		this.$startRecording.classList.add('hidden');
		this.$stopRecording.classList.remove('hidden');
	}

	stopRecording() {
		if (!this.mediaRecorder) return;

		this.mediaRecorder.stop();

		this.$startRecording.classList.remove('hidden');
		this.$stopRecording.classList.add('hidden');
	}

	handleStop() {
		const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
		const reader = new FileReader();

		reader.onloadend = async () => {
			const arrayBuffer = reader.result;
			try {
				const buffer = await this.audioContext.decodeAudioData(arrayBuffer);
				this.voiceBuffer = buffer;
			} catch (error) {
				console.error('Error decoding audio data:', error);
			}
		};

		reader.readAsArrayBuffer(blob);
	}
}
