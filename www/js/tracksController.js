class TrackController {
	constructor() {
		this.tracksPlayer = new TracksPlayer();
		this.audioRecorder = new AudioRecorder();

		Tone.Transport.bpm.value = 120;
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

		if (active) {
			this.tracksPlayer.tracks[track].notes[note] = false;
			cell.classList.remove('active');
		} else {
			this.tracksPlayer.tracks[track].notes[note] = true;
			cell.classList.add('active');
		}
	}
}
