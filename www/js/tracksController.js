class TrackController {
	constructor() {
		this.audioRecorder = new AudioRecorder();
		this.audioRecorder.createStream();
		this.tracksPlayer = new TracksPlayer();

		Tone.Transport.bpm.value = 120;
		document.getElementById('bpm').value = 120;
	}

	addTrack(track) {
		this.tracksPlayer.tracks.push(track);
	}

	init() {
		this.tracksPlayer.initTracksGrid();

		document
			.querySelectorAll('.cell')
			.forEach(cell =>
				cell.addEventListener('click', e => this.cellClickEvent(e)),
			);
	}

	cellClickEvent(e) {
		const cell = e.target;
		const track = cell.getAttribute('data-track');
		const note = cell.getAttribute('data-cell');

		let active = this.tracksPlayer.tracks[track].notes[note];

		if (active) cell.classList.remove('active');
		else cell.classList.add('active');

		this.tracksPlayer.tracks[track].notes[note] = !active;
	}

	addVoice() {
		// add the audioRecorder.voiceBuffer to the tracksPlayer
		// let voice = new Tone.Player(this.audioRecorder.voiceBuffer).toDestination();
		// this.addTrack(
		// 	new Track(null, time => {
		// 		voice.start(time);
		// 	}),
		// );
	}
}
