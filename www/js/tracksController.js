class TrackController {
	/**
	 * Initializes a new instance of the class.
	 * Sets up the audio recorder and tracks player, and initializes the BPM (beats per minute) value.
	 *
	 * @constructor
	 */
	constructor() {
		this.audioRecorder = new AudioRecorder();
		this.audioRecorder.createStream();
		this.tracksPlayer = new TracksPlayer();

		Tone.Transport.bpm.value = 120;
		document.getElementById('bpm').value = 120;
	}

	/**
	 * Adds a track to the tracks player.
	 *
	 * @param {Object} track - The track object to be added.
	 */
	addTrack(track) {
		this.tracksPlayer.tracks.push(track);
	}

	/**
	 * Initializes the tracks controller.
	 * Sets up the tracks grid and attaches click event listeners to each cell.
	 */
	init() {
		this.tracksPlayer.initTracksGrid();

		document
			.querySelectorAll('.cell')
			.forEach(cell =>
				cell.addEventListener('click', e => this.cellClickEvent(e)),
			);
	}

	/**
	 * Handles the click event on a cell in the track grid.
	 * Toggles the 'active' class on the clicked cell and updates the corresponding note's active state.
	 *
	 * @param {Event} e - The click event object.
	 */
	cellClickEvent(e) {
		const cell = e.target;
		const track = cell.getAttribute('data-track');
		const note = cell.getAttribute('data-cell');

		let active = this.tracksPlayer.tracks[track].notes[note];

		if (active) cell.classList.remove('active');
		else cell.classList.add('active');

		this.tracksPlayer.tracks[track].notes[note] = !active;
	}
}
