import Track from './track.js';

export default class TracksPlayer {
	constructor(audioContext) {
		this.audioContext = audioContext;
		this.tracks = [];
		this.$tracks = document.querySelector('#tracks');
		this.trackLength = 0;

		this.$play = document.querySelector('#play');
		this.$pause = document.querySelector('#pause');
		this.$stop = document.querySelector('#stop');
	}

	play() {
		this.tracks.forEach(track => track.play());
	}

	pause() {
		this.tracks.forEach(track => track.pause());
	}

	stop() {
		this.tracks.forEach(track => track.stop());
	}

	addTrack(audioContext, audioPath) {
		fetch(audioPath)
			.then(response => response.arrayBuffer())
			.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
			.then(audioBuffer => {
				const track = new Track(audioContext, audioBuffer, audioPath);
				this.tracks.push(track);

				const $track = document.createElement('div');
				$track.innerHTML = audioPath;
				this.$tracks.appendChild($track);
				this.trackLength += audioBuffer.duration;
			});
	}
}
