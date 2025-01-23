class AudioRecorder {
	/**
	 * Initializes a new instance of the audio recorder.
	 * Sets up the media stream, media recorder, and audio context.
	 * Binds event listeners to start and stop recording buttons.
	 *
	 * @constructor
	 */
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

	/**
	 * Initializes the audio stream for recording.
	 *
	 * This method checks if the User Media API is supported by the browser. If supported,
	 * it requests access to the user's microphone. Upon successful access, it sets up the
	 * media stream and initializes the MediaRecorder for recording audio.
	 *
	 * If the User Media API is not supported or if there is an error accessing the microphone,
	 * an alert is displayed to the user.
	 *
	 * @returns {void}
	 */
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

	/**
	 * Handles the event when recorder data is available.
	 *
	 * @param {Event} e - The event object containing the recorded audio data.
	 * @property {Blob} e.data - The recorded audio data as a Blob.
	 */
	recorderDataAvailable(e) {
		if (e.data.size == 0) return;
		this.audioChunks.push(e.data);
	}

	/**
	 * Starts the audio recording process.
	 * Initializes an empty array to store audio chunks and starts the media recorder.
	 * Updates the UI to reflect the recording state by hiding the start button and showing the stop button.
	 *
	 * @returns {void}
	 */
	startRecording() {
		if (!this.mediaRecorder) return;

		this.audioChunks = [];
		this.mediaRecorder.start();

		this.$startRecording.classList.add('hidden');
		this.$stopRecording.classList.remove('hidden');
	}

	/**
	 * Stops the recording if a media recorder is active.
	 *
	 * This method stops the media recorder, if it exists, and updates the UI
	 * to reflect that recording has stopped by showing the start recording button
	 * and hiding the stop recording button.
	 */
	stopRecording() {
		if (!this.mediaRecorder) return;

		this.mediaRecorder.stop();

		this.$startRecording.classList.remove('hidden');
		this.$stopRecording.classList.add('hidden');
	}

	/**
	 * Handles the stop event of the audio recording.
	 * Converts the recorded audio chunks into a Blob, reads it as an ArrayBuffer,
	 * and decodes the audio data to store it in the voiceBuffer.
	 *
	 * @async
	 * @method handleStop
	 * @returns {void}
	 * @throws Will log an error to the console if decoding audio data fails.
	 */
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
