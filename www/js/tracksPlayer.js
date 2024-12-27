class TracksPlayer {
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

	pause() {
		Tone.Transport.pause();
	}

	stop() {
		Tone.Transport.stop();
	}

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

	initTracksGrid() {
		this.$tracks.innerHTML = `
			${this.tracks
				.map(
					(track, x) => `
				<div class="track">
					${track.notes
						.map(
							(note, y) => `
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
