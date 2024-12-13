export default class Track {
	constructor(audioContext, audioBuffer, audioPath) {
		this.audioContext = audioContext;
		this.audioBuffer = audioBuffer;
		this.audio = new Audio(audioPath);
		this.offset = 0;
		this.isPlaying = false;
		this.source = null;

		var audioSource = audioContext.createMediaElementSource(this.audio);
		var volume = audioContext.createGain();
		volume.gain.value = 0.2;

		audioSource.connect(volume);
		audioSource.connect(audioContext.destination);
		volume.connect(audioContext.destination);
	}

	play() {
		if (!this.audioBuffer) return;

		if (this.audioContext.state === 'suspended') {
			this.audioContext.resume();
		}

		audio.play();
	}

	pause() {
		if (!this.audioBuffer) return;

		audio.pause();
	}

	stop() {
		if (!this.audioBuffer) return;

		audio.pause();
		audio.currentTime = 0;
	}

	setOffset(offset) {
		this.offset = offset;
	}

	getOffset() {
		return this.offset;
	}
}
