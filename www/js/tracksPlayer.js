class TracksPlayer {
	/**
	 * Creates an instance of the tracksPlayer class.
	 * Initializes the tracks array, sets up DOM elements, and event listeners for play, pause, and stop buttons.
	 * Sets up Tone.js Transport event listeners and a Tone.js Sequence for handling the playback loop.
	 *
	 * @constructor
	 */
	constructor() {
		this.tracks = [];
		this.$tracks = document.querySelector('#tracks');

		document
			.getElementById('play')
			.addEventListener('click', () => this.play());
		document
			.getElementById('pause')
			.addEventListener('click', () => this.pause());
		document
			.getElementById('stop')
			.addEventListener('click', () => this.stop());

		this.started = false;
		this.highlighted = -1;

		Tone.Transport.on('start', () => {
			this.started = true;
		});
		Tone.Transport.on('stop', () => {
			this.started = false;
			this.highlighted = -1;
			this.drawLoop(true);
		});

		this.sequence = new Tone.Sequence(
			(time, note) => this.tick(time, note),
			Array.from({ length: CELL_COUNT }, (_v, i) => i),
			'8n',
		).start(0);
		this.sequence.loop = true;
		this.sequence.loopEnd = `${CELL_COUNT / 4}m`;
	}

	/**
	 * Plays the audio track using Tone.js.
	 * If a voice buffer is available in the audio recorder, it creates a new Tone.Player
	 * instance with the voice buffer, sets it to loop, and starts playback.
	 * Then, it starts the Tone.js Transport to begin playback of all scheduled events.
	 */
	play() {
		if (trackController.audioRecorder.voiceBuffer) {
			let voice = new Tone.Player({
				url: trackController.audioRecorder.voiceBuffer,
				loop: true,
				loopStart: 0,
				loopEnd: `${CELL_COUNT / 4}m`,
			}).toDestination();
			voice.start();
		}
		Tone.Transport.start();
	}

	/**
	 * Pauses the Tone.js Transport, effectively pausing the playback of all scheduled events.
	 */
	pause() {
		Tone.Transport.pause();
	}

	/**
	 * Stops the Tone.js Transport, halting all scheduled events and playback.
	 */
	stop() {
		Tone.Transport.stop();
	}

	/**
	 * Handles the ticking of the tracks player.
	 *
	 * @param {number} time - The time at which the tick occurs.
	 * @param {number} note - The note to be played at the given time.
	 */
	tick(time, note) {
		if (!time) return;

		Tone.Draw.schedule(() => {
			if (this.started) {
				this.highlighted = note;
				this.drawLoop();
			}
		}, time);

		this.tracks.forEach((track, index) => {
			if (track.notes[note]) {
				try {
					track.play(time);
				} catch (error) {
					console.error(error);
				}
			}
		});
	}

	/**
	 * Initializes the tracks grid by populating the inner HTML of the tracks container.
	 * Each track is represented as a div element containing buttons for each note.
	 * The buttons are assigned data attributes for track and cell indices.
	 */
	initTracksGrid() {
		this.$tracks.innerHTML = `
			${this.tracks
				.map(
					(track, x) => `
				<div class="track">
					${track.notes
						.map(
							(_, y) => `
						<button type="button" class="cell" data-track="${x}" data-cell="${y}" title="cell ${x} ${y}"></button>
					`,
						)
						.join('')}
				</div>
			`,
				)
				.join('')}
			`;
	}

	/**
	 * Updates the visual state of track cells by removing the 'highlight' class from all cells
	 * and adding it to the currently highlighted cell if applicable.
	 *
	 * @param {boolean} [clear=false] - If true, the highlighted cell will not be highlighted.
	 */
	drawLoop(clear = false) {
		this.$tracks.querySelectorAll('.cell').forEach(cell => {
			cell.classList.remove('highlight');
		});

		if (this.highlighted >= 0 && !clear) {
			this.$tracks
				.querySelectorAll(`.cell[data-cell="${this.highlighted}"]`)
				.forEach(cell => {
					cell.classList.add('highlight');
				});
		}
	}
}
